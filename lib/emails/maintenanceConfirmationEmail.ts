import { BANK_DETAILS } from "@/lib/bankDetails";

export function maintenanceConfirmationEmail(data: {
  name: string;
  maintenanceRef: string;
  packageTitle: string;
  finalPrice: string;
  originalPrice: string;
  discountApplied: boolean;
  subscriptionStart: string;
  subscriptionEnd: string;
  clientType: "new" | "existing";
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eccentricdigital.com";
  const firstName = data.name.split(" ")[0];

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
    } catch { return iso; }
  };

  const discountRow = data.discountApplied
    ? `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #161616;width:35%;vertical-align:top;">
          <span style="font-size:12px;color:#4b5563;">Original Price</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
          <span style="font-size:14px;color:#6b7280;font-weight:600;text-decoration:line-through;">${data.originalPrice} JMD</span>
          <span style="margin-left:8px;font-size:11px;color:#24eda2;font-weight:700;">-10% Loyalty Discount</span>
        </td>
      </tr>`
    : "";

  const bankText = BANK_DETAILS.map((b) => {
    const local = `${b.bank}\nAccount Name: ${b.accountName}\nAccount No.: ${b.accountNumber}\nBranch: ${b.branch}`;
    return local;
  }).join("\n\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Maintenance Subscription Confirmed — Eccentric Digital</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Segoe UI',system-ui,Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#080808;">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <tr>
            <td style="padding:40px 48px 36px;background:#0f0f0f;border-radius:20px 20px 0 0;border:1px solid #1e1e1e;border-bottom:none;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <img src="https://www.eccentricdigital.com/_next/image?url=%2Feccentriclogo.png&w=128&q=75" alt="Eccentric Digital" width="50" height="50" style="display:block;">
                  </td>
                  <td align="right">
                    <span style="font-size:11px;color:#24eda2;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Maintenance Subscription</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;background:#0f0f0f;">
              <div style="height:2px;background:linear-gradient(90deg,#24eda2,#00a3f8);"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:48px;background:#0f0f0f;border:1px solid #1e1e1e;border-top:none;border-bottom:none;">

              <p style="margin:0 0 6px;font-size:12px;color:#24eda2;text-transform:uppercase;letter-spacing:2.5px;font-weight:600;">
                ${data.clientType === "existing" ? "Subscription Renewal" : "New Subscription"}
              </p>
              <h1 style="margin:0 0 20px;font-size:30px;font-weight:800;line-height:1.25;color:#ffffff;">
                You're all set,<br/>${firstName}.
              </h1>

              <div style="background:linear-gradient(135deg,rgba(36,237,162,0.08),rgba(0,163,248,0.08));border:1px solid rgba(36,237,162,0.2);border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center;">
                <p style="margin:0 0 6px;font-size:10px;color:#24eda2;text-transform:uppercase;letter-spacing:3px;font-weight:700;">Your Maintenance Reference</p>
                <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:3px;color:#ffffff;font-family:monospace;">${data.maintenanceRef}</p>
                <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">Use this reference to track your subscription at eccentricdigital.com/payment</p>
              </div>

              <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:28px;margin-bottom:32px;">
                <p style="margin:0 0 18px;font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#374151;font-weight:700;">Subscription Details</p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;width:35%;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Package</span>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${data.packageTitle}</span>
                    </td>
                  </tr>
                  ${discountRow}
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;width:35%;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Monthly Rate</span>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#24eda2;font-weight:700;">${data.finalPrice} JMD / mo</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Start Date</span>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${fmtDate(data.subscriptionStart)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Renewal Date</span>
                    </td>
                    <td style="padding:12px 0;vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${fmtDate(data.subscriptionEnd)}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:28px;margin-bottom:28px;">
                <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#374151;font-weight:700;">How to Pay</p>
                <p style="margin:0 0 18px;font-size:13px;color:#6b7280;line-height:1.6;">Transfer your first month's payment to either account below. Use your maintenance reference as the transfer description.</p>

                <div style="background:rgba(36,237,162,0.06);border:1px solid rgba(36,237,162,0.15);border-radius:10px;padding:14px 18px;margin-bottom:20px;">
                  <p style="margin:0 0 3px;font-size:10px;color:#24eda2;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Transfer Reference</p>
                  <p style="margin:0;font-size:18px;font-weight:900;letter-spacing:3px;color:#ffffff;font-family:monospace;">${data.maintenanceRef}</p>
                </div>

                <p style="margin:0;font-size:12px;color:#374151;text-align:center;">
                  After paying, visit <a href="${siteUrl}/payment" style="color:#24eda2;text-decoration:none;">${siteUrl}/payment</a> and enter your reference to confirm.
                </p>
              </div>

              <div style="text-align:center;">
                <a href="${siteUrl}/payment" style="display:inline-block;padding:15px 40px;background:linear-gradient(90deg,#24eda2,#00a3f8);border-radius:10px;color:#000000;font-weight:700;font-size:15px;text-decoration:none;">
                  View Subscription →
                </a>
              </div>

            </td>
          </tr>

          <tr>
            <td style="padding:28px 48px;background:#090909;border:1px solid #1e1e1e;border-top:none;border-radius:0 0 20px 20px;">
              <p style="margin:0 0 6px;font-size:13px;color:#4b5563;text-align:center;">— The Eccentric Digital Team</p>
              <p style="margin:0;font-size:11px;color:#262626;text-align:center;">© ${new Date().getFullYear()} Eccentric Digital. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Maintenance Subscription — Eccentric Digital

Hi ${firstName},

Your website maintenance subscription has been received.

Maintenance Reference: ${data.maintenanceRef}

SUBSCRIPTION DETAILS
Package: ${data.packageTitle}
${data.discountApplied ? `Original Price: ${data.originalPrice} JMD (10% loyalty discount applied)\n` : ""}Monthly Rate: ${data.finalPrice} JMD/mo
Start Date: ${fmtDate(data.subscriptionStart)}
Renewal Date: ${fmtDate(data.subscriptionEnd)}

HOW TO PAY
Transfer your first month's payment to one of our bank accounts (see below). Use your maintenance reference (${data.maintenanceRef}) as the transfer description.

${bankText}

After transferring, visit ${siteUrl}/payment to confirm your payment.

— The Eccentric Digital Team
${siteUrl}`;

  return { html, text };
}
