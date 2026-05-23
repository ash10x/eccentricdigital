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
      service,
      package: selectedPackage,
      date,
      time,
      message,
    } = body as {
      name: string;
      email: string;
      service: string;
      package: string;
      date: string;
      time: string;
      message?: string;
    };

    if (!name || !email || !service || !selectedPackage || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    await db.insert(contactSubmissions).values({
      name,
      email,
      service,
      selectedPackage,
      preferredDate: date,
      preferredTime: time,
      message: message || "",
    });

    const fromEmail =
      process.env.FROM_EMAIL || "noreply@eccentricdigital.com";
    const adminEmail =
      process.env.ADMIN_EMAIL || "admin@eccentricdigital.com";

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
      service,
      selectedPackage,
      date,
      time,
      message,
    });

    await Promise.allSettled([
      transporter.sendMail({
        from: `Eccentric Digital <${fromEmail}>`,
        to: email,
        subject: "Application Received — Eccentric Digital",
        html: userEmail.html,
        text: userEmail.text,
      }),
      transporter.sendMail({
        from: `Eccentric Digital <${fromEmail}>`,
        to: adminEmail,
        subject: `New Project Application — ${name}`,
        html: adminEmailContent.html,
        text: adminEmailContent.text,
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
