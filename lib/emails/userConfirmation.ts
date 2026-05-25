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
  date: string;
  time: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eccentricdigital.com";
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
                    <div style="font-size:22px;font-weight:900;letter-spacing:-0.5px;">
                      <span style="background:linear-gradient(90deg,#24eda2,#00a3f8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#24eda2;">Eccentric Digital</span>
                    </div>
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
                  ${data.price ? `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">Price</span>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #161616;vertical-align:top;">
                      <span style="font-size:14px;color:#24eda2;font-weight:700;">${data.price} JMD</span>
                    </td>
                  </tr>` : ""}
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

              <!-- What's next -->
              <div style="background:linear-gradient(135deg,rgba(36,237,162,0.04),rgba(0,163,248,0.04));border:1px solid rgba(36,237,162,0.12);border-radius:14px;padding:24px;margin-bottom:40px;">
                <p style="margin:0 0 10px;font-size:11px;color:#24eda2;text-transform:uppercase;letter-spacing:2px;font-weight:600;">What Happens Next</p>
                <p style="margin:0;font-size:14px;color:#9ca3af;line-height:1.75;">
                  Our team will review your application, confirm availability for your selected time, and send you a personalized proposal tailored to your project goals.
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${siteUrl}/packages" style="display:inline-block;padding:15px 40px;background:linear-gradient(90deg,#24eda2,#00a3f8);border-radius:10px;color:#000000;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:-0.2px;">
                  Explore Our Packages →
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

  const text = `Application Received — Eccentric Digital

Hi ${firstName},

Your consultation application has been received. We'll be in touch within 24 hours.

BOOKING SUMMARY
Service: ${serviceLabel}
Package: ${data.selectedPackage}
${data.price ? `Price: ${data.price} JMD\n` : ""}Preferred Date: ${formattedDate}
Preferred Time: ${data.time}

— The Eccentric Digital Team
${siteUrl}`;

  return { html, text };
}
