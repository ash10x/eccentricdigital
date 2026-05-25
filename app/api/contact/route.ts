import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { transporter } from "@/lib/mailer";
import { userConfirmationEmail } from "@/lib/emails/userConfirmation";
import { adminNotificationEmail } from "@/lib/emails/adminNotification";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      service,
      package: selectedPackage,
      date,
      time,
      message,
    } = body as {
      name: string;
      email: string;
      phone: string;
      service: string;
      package: string;
      date: string;
      time: string;
      message?: string;
    };

    if (!name || !email || !phone || !service || !selectedPackage || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    await db.insert(contactSubmissions).values({
      name,
      email,
      phone,
      service,
      selectedPackage,
      preferredDate: date,
      preferredTime: time,
      message: message || "",
    });

    const fromEmail =
      process.env.FROM_EMAIL || "noreply@eccentricdigital.com";
    const adminEmails = (process.env.ADMIN_EMAIL || "admin@eccentricdigital.com")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    const userEmail = userConfirmationEmail({
      name,
      service,
      selectedPackage,
      date,
      time,
    });

    const adminEmailContent = adminNotificationEmail({
      name,
      email,
      phone,
      service,
      selectedPackage,
      date,
      time,
      message,
    });

    const [userResult, adminResult] = await Promise.allSettled([
      transporter.sendMail({
        from: `Eccentric Digital <${fromEmail}>`,
        to: email,
        subject: "Application Received — Eccentric Digital",
        html: userEmail.html,
        text: userEmail.text,
      }),
      transporter.sendMail({
        from: `Eccentric Digital <${fromEmail}>`,
        to: adminEmails,
        subject: `New Project Application — ${name}`,
        html: adminEmailContent.html,
        text: adminEmailContent.text,
      }),
    ]);

    if (userResult.status === "rejected") {
      console.error("User confirmation email failed:", userResult.reason);
    }
    if (adminResult.status === "rejected") {
      console.error("Admin notification email failed:", adminResult.reason);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
