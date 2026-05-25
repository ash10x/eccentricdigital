import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { transporter } from "@/lib/mailer";
import { paymentConfirmationEmail, type PaymentEvent } from "@/lib/emails/paymentConfirmation";
import { paymentAdminNotificationEmail } from "@/lib/emails/paymentAdminNotification";

const serviceLabels: Record<string, string> = {
  "custom-design": "Custom Web Design",
  ecommerce: "E-commerce Website",
  maintenance: "Website Maintenance",
  remodeling: "Website Remodel",
};

const VALID_STATUSES = ["unpaid", "deposit_paid", "fully_paid"] as const;
type PaymentStatus = (typeof VALID_STATUSES)[number];

function isValidRef(ref: string) {
  return /^ED-[A-Z0-9]{6}$/.test(ref);
}

function resolveEvent(prev: PaymentStatus, next: PaymentStatus): PaymentEvent | null {
  if (prev === "unpaid" && next === "deposit_paid") return "deposit_received";
  if (prev === "unpaid" && next === "fully_paid") return "full_payment_received";
  if (prev === "deposit_paid" && next === "fully_paid") return "final_payment_received";
  return null;
}

function parseAmount(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
}

function formatJmd(amount: number): string {
  return "$" + amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")?.trim().toUpperCase();

  if (!ref || !isValidRef(ref)) {
    return NextResponse.json({ error: "Invalid reference number format." }, { status: 400 });
  }

  const rows = await db
    .select({
      referenceNumber: contactSubmissions.referenceNumber,
      name: contactSubmissions.name,
      service: contactSubmissions.service,
      selectedPackage: contactSubmissions.selectedPackage,
      price: contactSubmissions.price,
      preferredDate: contactSubmissions.preferredDate,
      preferredTime: contactSubmissions.preferredTime,
      paymentStatus: contactSubmissions.paymentStatus,
      createdAt: contactSubmissions.createdAt,
    })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.referenceNumber, ref))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "No booking found for that reference number." }, { status: 404 });
  }

  const row = rows[0];
  return NextResponse.json({
    referenceNumber: row.referenceNumber,
    name: row.name,
    service: serviceLabels[row.service] || row.service,
    selectedPackage: row.selectedPackage,
    price: row.price,
    preferredDate: row.preferredDate,
    preferredTime: row.preferredTime,
    paymentStatus: row.paymentStatus as PaymentStatus,
    createdAt: row.createdAt,
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ref = (body.referenceNumber as string)?.trim().toUpperCase();
  const newStatus = body.paymentStatus as string;

  if (!ref || !isValidRef(ref)) {
    return NextResponse.json({ error: "Invalid reference number." }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(newStatus as PaymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
  }

  // Fetch full submission before updating so we have email, name, and previous status
  const rows = await db
    .select({
      name: contactSubmissions.name,
      email: contactSubmissions.email,
      phone: contactSubmissions.phone,
      service: contactSubmissions.service,
      selectedPackage: contactSubmissions.selectedPackage,
      price: contactSubmissions.price,
      paymentStatus: contactSubmissions.paymentStatus,
    })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.referenceNumber, ref))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const submission = rows[0];
  const prevStatus = submission.paymentStatus as PaymentStatus;
  const event = resolveEvent(prevStatus, newStatus as PaymentStatus);

  await db
    .update(contactSubmissions)
    .set({ paymentStatus: newStatus })
    .where(eq(contactSubmissions.referenceNumber, ref));

  // Send emails if a recognisable payment event occurred
  if (event) {
    const totalAmount = parseAmount(submission.price);
    const depositAmount = Math.round(totalAmount * 0.5);
    const amountPaid =
      event === "deposit_received"
        ? formatJmd(depositAmount)
        : event === "final_payment_received"
        ? formatJmd(depositAmount)
        : formatJmd(totalAmount);

    const serviceLabel = serviceLabels[submission.service] || submission.service;
    const fromEmail = process.env.FROM_EMAIL || "noreply@eccentricdigital.com";
    const adminEmails = (process.env.ADMIN_EMAIL || "admin@eccentricdigital.com")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    const userEmail = paymentConfirmationEmail({
      name: submission.name,
      referenceNumber: ref,
      service: serviceLabel,
      selectedPackage: submission.selectedPackage,
      amountPaid,
      event,
    });

    const adminEmail = paymentAdminNotificationEmail({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      referenceNumber: ref,
      service: serviceLabel,
      selectedPackage: submission.selectedPackage,
      amountPaid,
      totalPrice: formatJmd(totalAmount),
      event,
    });

    await Promise.allSettled([
      transporter.sendMail({
        from: `Eccentric Digital <${fromEmail}>`,
        to: submission.email,
        subject: userEmail.subject,
        html: userEmail.html,
        text: userEmail.text,
      }),
      transporter.sendMail({
        from: `Eccentric Digital <${fromEmail}>`,
        to: adminEmails,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
      }),
    ]);
  }

  return NextResponse.json({ success: true, paymentStatus: newStatus });
}
