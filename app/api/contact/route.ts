import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions, maintenanceSubscriptions } from "@/db/schema";
import { transporter } from "@/lib/mailer";
import { userConfirmationEmail } from "@/lib/emails/userConfirmation";
import { adminNotificationEmail } from "@/lib/emails/adminNotification";
import { maintenanceConfirmationEmail } from "@/lib/emails/maintenanceConfirmationEmail";
import { generateRefNumber } from "@/lib/generateRefNumber";
import { generateMaintenanceRef } from "@/lib/generateMaintenanceRef";

const SUBSCRIPTION_DAYS = 30;

function applyDiscount(price: string, pct: number): string {
  const num = parseFloat(price.replace(/[^0-9.]/g, ""));
  if (!num) return price;
  const discounted = Math.round(num * (1 - pct / 100));
  return "$" + discounted.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      businessName,
      email,
      phone,
      service,
      package: selectedPackage,
      price,
      date,
      time,
      message,
      clientType,
      existingRef,
    } = body as {
      name: string;
      businessName?: string;
      email: string;
      phone: string;
      service: string;
      package: string;
      price?: string;
      date: string;
      time: string;
      message?: string;
      clientType?: "new" | "existing";
      existingRef?: string;
    };

    if (!name || !email || !phone || !service || !selectedPackage || !date || !time) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const fromEmail = process.env.FROM_EMAIL || "noreply@eccentricdigital.com";
    const adminEmails = (process.env.ADMIN_EMAIL || "admin@eccentricdigital.com")
      .split(",").map((e) => e.trim()).filter(Boolean);

    // ── MAINTENANCE SUBSCRIPTION PATH ──────────────────────────────────────
    if (service === "maintenance") {
      const isExisting = clientType === "existing" && !!existingRef;
      const maintenanceRef = generateMaintenanceRef(isExisting ? existingRef : undefined);

      const originalPrice = price || "";
      const finalPrice = isExisting ? applyDiscount(originalPrice, 10) : originalPrice;

      const now = new Date();
      const subEnd = new Date(now);
      subEnd.setDate(subEnd.getDate() + SUBSCRIPTION_DAYS);

      await db.insert(maintenanceSubscriptions).values({
        maintenanceRef,
        existingRef: isExisting ? existingRef : null,
        clientType: isExisting ? "existing" : "new",
        name,
        businessName: businessName || "",
        email,
        phone,
        packageTitle: selectedPackage,
        originalPrice,
        finalPrice,
        discountApplied: isExisting,
        subscriptionStart: now,
        subscriptionEnd: subEnd,
        status: "pending",
        paymentStatus: "unpaid",
      });

      const confirmEmail = maintenanceConfirmationEmail({
        name,
        maintenanceRef,
        packageTitle: selectedPackage,
        finalPrice,
        originalPrice,
        discountApplied: isExisting,
        subscriptionStart: now.toISOString(),
        subscriptionEnd: subEnd.toISOString(),
        clientType: isExisting ? "existing" : "new",
      });

      const adminEmailContent = adminNotificationEmail({
        name,
        businessName,
        email,
        phone,
        service: "maintenance",
        selectedPackage,
        price: finalPrice,
        referenceNumber: maintenanceRef,
        date,
        time,
        message,
      });

      await Promise.allSettled([
        transporter.sendMail({
          from: `Eccentric Digital <${fromEmail}>`,
          to: email,
          subject: `Maintenance Subscription Confirmed — Ref: ${maintenanceRef}`,
          html: confirmEmail.html,
          text: confirmEmail.text,
        }),
        transporter.sendMail({
          from: `Eccentric Digital <${fromEmail}>`,
          to: adminEmails,
          subject: `New Maintenance Subscription — ${name} [${maintenanceRef}]`,
          html: adminEmailContent.html,
          text: adminEmailContent.text,
        }),
      ]);

      return NextResponse.json({ success: true, referenceNumber: maintenanceRef, type: "maintenance" }, { status: 200 });
    }

    // ── STANDARD BOOKING PATH ───────────────────────────────────────────────
    const referenceNumber = generateRefNumber();

    await db.insert(contactSubmissions).values({
      referenceNumber,
      name,
      businessName: businessName || "",
      email,
      phone,
      service,
      selectedPackage,
      price: price || "",
      preferredDate: date,
      preferredTime: time,
      message: message || "",
    });

    const userEmail = userConfirmationEmail({ name, service, selectedPackage, price, referenceNumber, date, time });
    const adminEmailContent = adminNotificationEmail({ name, businessName, email, phone, service, selectedPackage, price, referenceNumber, date, time, message });

    const [userResult, adminResult] = await Promise.allSettled([
      transporter.sendMail({ from: `Eccentric Digital <${fromEmail}>`, to: email, subject: `Application Received — Ref: ${referenceNumber}`, html: userEmail.html, text: userEmail.text }),
      transporter.sendMail({ from: `Eccentric Digital <${fromEmail}>`, to: adminEmails, subject: `New Application — ${name} [${referenceNumber}]`, html: adminEmailContent.html, text: adminEmailContent.text }),
    ]);

    if (userResult.status === "rejected") console.error("User confirmation email failed:", userResult.reason);
    if (adminResult.status === "rejected") console.error("Admin notification email failed:", adminResult.reason);

    return NextResponse.json({ success: true, referenceNumber, type: "booking" }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
