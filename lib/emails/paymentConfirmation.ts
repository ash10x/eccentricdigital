import { BANK_DETAILS } from "@/lib/bankDetails";

export type PaymentEvent = "deposit_received" | "full_payment_received" | "final_payment_received";

const EVENT_COPY: Record<PaymentEvent, { subject: string; headline: string; badge: string; amountLabel: string }> = {
  deposit_received: {
    subject: "Deposit Received — Eccentric Digital",
    headline: "Deposit Confirmed.",
    badge: "Deposit Received",
    amountLabel: "Deposit (50%)",
  },
  full_payment_received: {
    subject: "Payment Confirmed — Eccentric Digital",
    headline: "Payment Complete.",
    badge: "Fully Paid",
    amountLabel: "Full Payment",
  },
  final_payment_received: {
    subject: "Final Payment Received — Eccentric Digital",
    headline: "Balance Cleared.",
    badge: "Fully Paid",
    amountLabel: "Final Balance",
  },
};

const NEXT_STEPS: Record<PaymentEvent, string> = {
  deposit_received:
    "Your slot is now secured. Our team will reach out within 24 hours to kick off your project. The remaining balance is due on delivery.",
  full_payment_received:
    "Your project is fully confirmed and our team will be in touch within 24 hours to begin the onboarding process.",
  final_payment_received:
    "Your balance has been cleared. We're excited to deliver your completed project — our team will be in touch very soon.",
};

export function paymentConfirmationEmail(data: {
  name: string;
  referenceNumber: string;
  service: string;
  selectedPackage: string;
  amountPaid: string;
  event: PaymentEvent;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eccentricdigital.com";
  const firstName = data.name.split(" ")[0];
  const copy = EVENT_COPY[data.event];
  const nextStep = NEXT_STEPS[data.event];
  const isDeposit = data.event === "deposit_received";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${copy.subject}</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Segoe UI',system-ui,Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#080808;">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 36px;background:#0f0f0f;border-radius:20px 20px 0 0;border:1px solid #1e1e1e;border-bottom:none;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <div style="font-size:22px;font-weight:900;letter-spacing:-0.5px;">
                      <span style="background:linear-gradient(90deg,#24eda2,#00a3f8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#24eda2;">Eccentric Digital</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;padding:4px 12px;border-radius:999px;background:${isDeposit ? "rgba(251,191,36,0.12)" : "rgba(36,237,162,0.12)"};border:1px solid ${isDeposit ? "rgba(251,191,36,0.25)" : "rgba(36,237,162,0.25)"};font-size:11px;font-weight:700;color:${isDeposit ? "#fbbf24" : "#24eda2"};text-transform:uppercase;letter-spacing:1.5px;">
                      ${copy.badge}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gradient line -->
          <tr>
            <td style="border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;background:#0f0f0f;">
              <div style="height:2px;background:linear-gradient(90deg,#24eda2,#00a3f8);"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px;background:#0f0f0f;border:1px solid #1e1e1e;border-top:none;border-bottom:none;">

              <p style="margin:0 0 6px;font-size:12px;color:#24eda2;text-transform:uppercase;letter-spacing:2.5px;font-weight:600;">
                Payment Confirmation
              </p>
              <h1 style="margin:0 0 24px;font-size:32px;font-weight:900;line-height:1.15;color:#ffffff;">
                ${copy.headline}<br/>
                <span style="color:#9ca3af;font-size:24px;font-weight:700;">Thank you, ${firstName}.</span>
              </h1>

              <!-- Amount card -->
              <div style="background:linear-gradient(135deg,rgba(36,237,162,0.06),rgba(0,163,248,0.06));border:1px solid rgba(36,237,162,0.15);border-radius:16px;padding:28px 32px;margin-bottom:32px;text-align:center;">
                <p style="margin:0 0 6px;font-size:10px;color:#24eda2;text-transform:uppercase;letter-spacing:3px;font-weight:700;">${copy.amountLabel} Received</p>
                <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:-1px;color:#ffffff;">${data.amountPaid}</p>
                <p style="margin:6px 0 0;font-size:12px;color:#6b7280;letter-spacing:1px;">JMD</p>
              </div>

              <!-- Booking summary -->
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:28px;margin-bottom:28px;">
                <p style="margin:0 0 18px;font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#374151;font-weight:700;">Booking Details</p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding:11px 0;border-bottom:1px solid #161616;width:38%;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Reference</span>
                    </td>
                    <td style="padding:11px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#24eda2;font-weight:700;letter-spacing:1.5px;font-family:monospace;">${data.referenceNumber}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:11px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Service</span>
                    </td>
                    <td style="padding:11px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${data.service}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:11px 0;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Package</span>
                    </td>
                    <td style="padding:11px 0;vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${data.selectedPackage}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Next steps -->
              <div style="background:linear-gradient(135deg,rgba(36,237,162,0.03),rgba(0,163,248,0.03));border:1px solid rgba(36,237,162,0.1);border-radius:14px;padding:24px;margin-bottom:36px;">
                <p style="margin:0 0 8px;font-size:11px;color:#24eda2;text-transform:uppercase;letter-spacing:2px;font-weight:600;">What Happens Next</p>
                <p style="margin:0;font-size:14px;color:#9ca3af;line-height:1.75;">${nextStep}</p>
              </div>

              ${isDeposit ? `<!-- Remaining balance bank details -->
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:28px;margin-bottom:28px;">
                <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#374151;font-weight:700;">Pay Your Remaining Balance</p>
                <p style="margin:0 0 18px;font-size:13px;color:#6b7280;line-height:1.6;">When you're ready to pay the remaining 50%, transfer to either account below using your reference number as the description.</p>

                <div style="background:rgba(36,237,162,0.06);border:1px solid rgba(36,237,162,0.15);border-radius:10px;padding:14px 18px;margin-bottom:18px;">
                  <p style="margin:0 0 3px;font-size:10px;color:#24eda2;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Transfer Description / Reference</p>
                  <p style="margin:0;font-size:18px;font-weight:900;letter-spacing:3px;color:#ffffff;font-family:monospace;">${data.referenceNumber}</p>
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    ${BANK_DETAILS.map((bank) => `
                    <td width="48%" style="vertical-align:top;padding:0 4px;">
                      <div style="background:#111111;border:1px solid #222222;border-radius:10px;padding:16px;">
                        <p style="margin:0 0 12px;font-size:10px;color:#24eda2;text-transform:uppercase;letter-spacing:2px;font-weight:700;">${bank.bank}</p>
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr><td style="padding:4px 0;font-size:11px;color:#4b5563;">Account Name</td></tr>
                          <tr><td style="padding:0 0 8px;font-size:12px;color:#ffffff;font-weight:600;">${bank.accountName}</td></tr>
                          <tr><td style="padding:4px 0;font-size:11px;color:#4b5563;">Account No.</td></tr>
                          <tr><td style="padding:0 0 8px;font-size:12px;color:#ffffff;font-weight:600;font-family:monospace;">${bank.accountNumber}</td></tr>
                          <tr><td style="padding:4px 0;font-size:11px;color:#4b5563;">Branch</td></tr>
                          <tr><td style="padding:0 0 ${bank.wire ? "12px" : "0"};font-size:12px;color:#ffffff;font-weight:600;">${bank.branch}</td></tr>
                        </table>
                        ${bank.wire ? `
                        <div style="border-top:1px solid #2a2a2a;margin-top:4px;padding-top:12px;">
                          <p style="margin:0 0 8px;font-size:9px;color:#00a3f8;text-transform:uppercase;letter-spacing:2px;font-weight:700;">International Wire</p>
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                            <tr><td style="padding:3px 0;font-size:10px;color:#4b5563;">SWIFT / BIC</td></tr>
                            <tr><td style="padding:0 0 6px;font-size:12px;color:#ffffff;font-weight:700;font-family:monospace;letter-spacing:1px;">${bank.wire.swiftCode}</td></tr>
                            <tr><td style="padding:3px 0;font-size:10px;color:#4b5563;">Bank Address</td></tr>
                            <tr><td style="padding:0 0 6px;font-size:11px;color:#d1d5db;font-weight:500;line-height:1.4;">${bank.wire.bankAddress}</td></tr>
                            ${bank.wire.correspondentBank ? `
                            <tr><td style="padding:3px 0;font-size:10px;color:#4b5563;">Correspondent Bank</td></tr>
                            <tr><td style="padding:0 0 6px;font-size:11px;color:#d1d5db;font-weight:500;">${bank.wire.correspondentBank}</td></tr>` : ""}
                            ${bank.wire.correspondentSwift ? `
                            <tr><td style="padding:3px 0;font-size:10px;color:#4b5563;">Correspondent SWIFT</td></tr>
                            <tr><td style="padding:0;font-size:11px;color:#d1d5db;font-weight:600;font-family:monospace;">${bank.wire.correspondentSwift}</td></tr>` : ""}
                          </table>
                        </div>` : ""}
                      </div>
                    </td>`).join('<td width="4%"></td>')}
                  </tr>
                </table>
              </div>` : ""}

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${siteUrl}/payment" style="display:inline-block;padding:15px 40px;background:linear-gradient(90deg,#24eda2,#00a3f8);border-radius:10px;color:#000000;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:-0.2px;">
                  View Booking →
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 48px;background:#090909;border:1px solid #1e1e1e;border-top:none;border-radius:0 0 20px 20px;">
              <p style="margin:0 0 6px;font-size:13px;color:#4b5563;text-align:center;">— The Eccentric Digital Team</p>
              <p style="margin:0;font-size:11px;color:#262626;text-align:center;">
                © ${new Date().getFullYear()} Eccentric Digital. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${copy.subject}

Hi ${firstName},

${copy.headline}

${copy.amountLabel}: ${data.amountPaid} JMD
Reference: ${data.referenceNumber}
Service: ${data.service}
Package: ${data.selectedPackage}

${nextStep}
${isDeposit ? `
PAY YOUR REMAINING BALANCE
When ready, transfer the remaining 50% to either account below.
Use your reference number (${data.referenceNumber}) as the transfer description.

${BANK_DETAILS.map((b) => {
  const local = `${b.bank}\nAccount Name: ${b.accountName}\nAccount No.: ${b.accountNumber}\nBranch: ${b.branch}`;
  const wire = b.wire
    ? `\n\n  International Wire\n  SWIFT / BIC: ${b.wire.swiftCode}\n  Bank Address: ${b.wire.bankAddress}${b.wire.correspondentBank ? `\n  Correspondent Bank: ${b.wire.correspondentBank}` : ""}${b.wire.correspondentSwift ? `\n  Correspondent SWIFT: ${b.wire.correspondentSwift}` : ""}`
    : "";
  return local + wire;
}).join("\n\n")}

Then visit ${siteUrl}/payment to confirm.
` : ""}
View your booking: ${siteUrl}/payment

— The Eccentric Digital Team`;

  return { html, text, subject: copy.subject };
}
