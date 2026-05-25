import { BANK_DETAILS } from "@/lib/bankDetails";

const serviceLabels: Record<string, string> = {
  "custom-design": "Custom Web Design",
  ecommerce: "E-commerce Website",
  maintenance: "Website Maintenance",
  remodeling: "Website Remodel",
};

export function userConfirmationEmail(data: {
  name: string;
  service: string;
  selectedPackage: string;
  price?: string;
  referenceNumber: string;
  date: string;
  time: string;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://eccentricdigital.com";
  const firstName = data.name.split(" ")[0];
  const serviceLabel = serviceLabels[data.service] || data.service;
  const formattedDate = (() => {
    try {
      return new Date(data.date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return data.date;
    }
  })();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received — Eccentric Digital</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Segoe UI',system-ui,Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#080808;">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- Logo Header -->
          <tr>
            <td style="padding:40px 48px 36px;background:#0f0f0f;border-radius:20px 20px 0 0;border:1px solid #1e1e1e;border-bottom:none;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <img src="	https://www.eccentricdigital.com/_next/image?url=%2Feccentriclogo.png&w=128&q=75" alt="Eccentric Digital" width="120" style="display:block;">
                  </td>
                  <td align="right">
                    <span style="font-size:11px;color:#4b5563;text-transform:uppercase;letter-spacing:2px;">Confirmation</span>
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

          <!-- Main body -->
          <tr>
            <td style="padding:48px;background:#0f0f0f;border:1px solid #1e1e1e;border-top:none;border-bottom:none;">

              <p style="margin:0 0 6px;font-size:12px;color:#24eda2;text-transform:uppercase;letter-spacing:2.5px;font-weight:600;">
                Application Received
              </p>
              <h1 style="margin:0 0 20px;font-size:30px;font-weight:800;line-height:1.25;color:#ffffff;">
                We've Got You,<br/>${firstName}.
              </h1>

              <!-- Reference number banner -->
              <div style="background:linear-gradient(135deg,rgba(36,237,162,0.08),rgba(0,163,248,0.08));border:1px solid rgba(36,237,162,0.2);border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center;">
                <p style="margin:0 0 6px;font-size:10px;color:#24eda2;text-transform:uppercase;letter-spacing:3px;font-weight:700;">Your Reference Number</p>
                <p style="margin:0;font-size:28px;font-weight:900;letter-spacing:4px;color:#ffffff;font-family:monospace;">${data.referenceNumber}</p>
                <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">Use this to look up your booking and make payment at eccentricdigital.com/payment</p>
              </div>

              <p style="margin:0 0 36px;font-size:15px;line-height:1.75;color:#9ca3af;">
                Your consultation application has been received and is under review. Our team will reach out within <strong style="color:#ffffff;">24 hours</strong> to confirm your booking and discuss next steps.
              </p>

              <!-- Booking card -->
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:28px;margin-bottom:32px;">
                <p style="margin:0 0 18px;font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#374151;font-weight:700;">
                  Booking Summary
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;width:35%;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Reference</span>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#24eda2;font-weight:700;letter-spacing:1.5px;font-family:monospace;">${data.referenceNumber}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;width:35%;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Service</span>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${serviceLabel}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Package</span>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${data.selectedPackage}</span>
                    </td>
                  </tr>
                  ${
                    data.price
                      ? `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Price</span>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#24eda2;font-weight:700;">${data.price} JMD</span>
                    </td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Preferred Date</span>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${formattedDate}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Preferred Time</span>
                    </td>
                    <td style="padding:12px 0;vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${data.time}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- How to Pay -->
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:28px;margin-bottom:28px;">
                <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#374151;font-weight:700;">How to Pay</p>
                <p style="margin:0 0 20px;font-size:13px;color:#6b7280;line-height:1.6;">Transfer your payment to either of the accounts below. Use your reference number as the transfer description so we can match your payment.</p>

                <!-- Reference highlight -->
                <div style="background:rgba(36,237,162,0.06);border:1px solid rgba(36,237,162,0.15);border-radius:10px;padding:14px 18px;margin-bottom:20px;">
                  <p style="margin:0 0 3px;font-size:10px;color:#24eda2;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Transfer Description / Reference</p>
                  <p style="margin:0;font-size:18px;font-weight:900;letter-spacing:3px;color:#ffffff;font-family:monospace;">${data.referenceNumber}</p>
                </div>

                <!-- Bank cards -->
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
                          <tr><td style="padding:0 0 8px;font-size:12px;color:#ffffff;font-weight:600;">${bank.branch}</td></tr>
                          <tr><td style="padding:4px 0;font-size:11px;color:#4b5563;">Account Type</td></tr>
                          <tr><td style="padding:0 0 ${bank.wire ? "12px" : "0"};font-size:12px;color:#ffffff;font-weight:600;">${bank.accountType}</td></tr>
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

                <p style="margin:16px 0 0;font-size:12px;color:#374151;text-align:center;">
                  After transferring, visit <a href="${siteUrl}/payment" style="color:#24eda2;text-decoration:none;">${siteUrl}/payment</a> and enter your reference number to confirm your payment.
                </p>
              </div>

              <!-- What's next -->
              <div style="background:linear-gradient(135deg,rgba(36,237,162,0.04),rgba(0,163,248,0.04));border:1px solid rgba(36,237,162,0.12);border-radius:14px;padding:24px;margin-bottom:40px;">
                <p style="margin:0 0 10px;font-size:11px;color:#24eda2;text-transform:uppercase;letter-spacing:2px;font-weight:600;">What Happens Next</p>
                <p style="margin:0;font-size:14px;color:#9ca3af;line-height:1.75;">
                  Our team will review your application, confirm availability for your selected time, and send you a personalized proposal tailored to your project goals.
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${siteUrl}/payment" style="display:inline-block;padding:15px 40px;background:linear-gradient(90deg,#24eda2,#00a3f8);border-radius:10px;color:#000000;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:-0.2px;">
                  Make Payment →
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

  const bankText = BANK_DETAILS.map((b) => {
    const local = `${b.bank}\nAccount Name: ${b.accountName}\nAccount No.: ${b.accountNumber}\nBranch: ${b.branch}\nAccount Type: ${b.accountType}`;
    const wire = b.wire
      ? `\n\n  International Wire\n  SWIFT / BIC: ${b.wire.swiftCode}\n  Bank Address: ${b.wire.bankAddress}${b.wire.correspondentBank ? `\n  Correspondent Bank: ${b.wire.correspondentBank}` : ""}${b.wire.correspondentSwift ? `\n  Correspondent SWIFT: ${b.wire.correspondentSwift}` : ""}`
      : "";
    return local + wire;
  }).join("\n\n");

  const text = `Application Received — Eccentric Digital

Hi ${firstName},

Your consultation application has been received. We'll be in touch within 24 hours.

Reference Number: ${data.referenceNumber}

BOOKING SUMMARY
Service: ${serviceLabel}
Package: ${data.selectedPackage}
${data.price ? `Price: ${data.price} JMD\n` : ""}Preferred Date: ${formattedDate}
Preferred Time: ${data.time}

HOW TO PAY
Transfer your payment to either account below. Use your reference number (${data.referenceNumber}) as the transfer description.

${bankText}

After transferring, visit ${siteUrl}/payment to confirm your payment.

— The Eccentric Digital Team
${siteUrl}`;

  return { html, text };
}
