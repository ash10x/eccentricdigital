import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { maintenanceSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isMaintenanceRef } from "@/lib/generateMaintenanceRef";
import { transporter } from "@/lib/mailer";
import { paymentConfirmationEmail } from "@/lib/emails/paymentConfirmation";
import { paymentAdminNotificationEmail } from "@/lib/emails/paymentAdminNotification";

const VALID_STATUSES = ["unpaid", "deposit_paid", "fully_paid"] as const;
type PaymentStatus = (typeof VALID_STATUSES)[number];

function parseAmount(price: string) {
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
}
function fmtJmd(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")?.trim().toUpperCase();

  if (!ref || !isMaintenanceRef(ref)) {
    return NextResponse.json({ error: "Invalid maintenance reference format." }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(maintenanceSubscriptions)
    .where(eq(maintenanceSubscriptions.maintenanceRef, ref))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "No subscription found for that reference." }, { status: 404 });
  }

  const sub = rows[0];

  // Compute subscription status dynamically
  const now = new Date();
  const end = new Date(sub.subscriptionEnd);
  const computedStatus = now > end ? "expired" : sub.status;

  return NextResponse.json({
    type: "maintenance",
    maintenanceRef: sub.maintenanceRef,
    existingRef: sub.existingRef,
    clientType: sub.clientType,
    name: sub.name,
    businessName: sub.businessName,
    packageTitle: sub.packageTitle,
    originalPrice: sub.originalPrice,
    finalPrice: sub.finalPrice,
    discountApplied: sub.discountApplied,
    subscriptionStart: sub.subscriptionStart,
    subscriptionEnd: sub.subscriptionEnd,
    status: computedStatus,
    paymentStatus: sub.paymentStatus,
    createdAt: sub.createdAt,
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ref = (body.maintenanceRef as string)?.trim().toUpperCase();
  const newStatus = body.paymentStatus as string;

  if (!ref || !isMaintenanceRef(ref)) {
    return NextResponse.json({ error: "Invalid maintenance reference." }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(newStatus as PaymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(maintenanceSubscriptions)
    .where(eq(maintenanceSubscriptions.maintenanceRef, ref))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Subscription not found." }, { status: 404 });
  }

  const sub = rows[0];
  const prevStatus = sub.paymentStatus as PaymentStatus;

  await db
    .update(maintenanceSubscriptions)
    .set({ paymentStatus: newStatus, ...(newStatus === "fully_paid" ? { status: "active" } : {}) })
    .where(eq(maintenanceSubscriptions.maintenanceRef, ref));

  // Send payment confirmation emails
  type PaymentEvent = "deposit_received" | "full_payment_received" | "final_payment_received";
  const eventMap: Record<string, PaymentEvent | null> = {
    "unpaid→deposit_paid": "deposit_received",
    "unpaid→fully_paid": "full_payment_received",
    "deposit_paid→fully_paid": "final_payment_received",
  };
  const event = eventMap[`${prevStatus}→${newStatus}`] ?? null;

  if (event) {
    const total = parseAmount(sub.finalPrice);
    const deposit = Math.round(total * 0.5);
    const amountPaid = event === "deposit_received" ? fmtJmd(deposit) : fmtJmd(total);

    const fromEmail = process.env.FROM_EMAIL || "noreply@eccentricdigital.com";
    const adminEmails = (process.env.ADMIN_EMAIL || "admin@eccentricdigital.com")
      .split(",").map((e) => e.trim()).filter(Boolean);

    const userEmail = paymentConfirmationEmail({
      name: sub.name,
      referenceNumber: ref,
      service: "Website Maintenance",
      selectedPackage: sub.packageTitle,
      amountPaid,
      event,
    });
    const adminEmail = paymentAdminNotificationEmail({
      name: sub.name,
      email: sub.email,
      phone: sub.phone,
      referenceNumber: ref,
      service: "Website Maintenance",
      selectedPackage: sub.packageTitle,
      amountPaid,
      totalPrice: fmtJmd(total),
      event,
    });

    await Promise.allSettled([
      transporter.sendMail({ from: `Eccentric Digital <${fromEmail}>`, to: sub.email, subject: userEmail.subject, html: userEmail.html, text: userEmail.text }),
      transporter.sendMail({ from: `Eccentric Digital <${fromEmail}>`, to: adminEmails, subject: adminEmail.subject, html: adminEmail.html, text: adminEmail.text }),
    ]);
  }

  return NextResponse.json({ success: true, paymentStatus: newStatus });
}
