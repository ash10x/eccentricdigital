const serviceLabels: Record<string, string> = {
  "custom-design": "Custom Web Design",
  ecommerce: "E-commerce Website",
  maintenance: "Website Maintenance",
  remodeling: "Website Remodel",
};

export function adminNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  selectedPackage: string;
  price?: string;
  date: string;
  time: string;
  message?: string;
}) {
  const serviceLabel = serviceLabels[data.service] || data.service;
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", `<a href="mailto:${data.email}" style="color:#24eda2;text-decoration:none;">${data.email}</a>`],
    ["Phone", `<a href="tel:${data.phone}" style="color:#24eda2;text-decoration:none;">${data.phone}</a>`],
    ["Service", serviceLabel],
    ["Package", data.selectedPackage],
    ...(data.price ? [["Price", `<span style="color:#24eda2;font-weight:700;">${data.price} JMD</span>`] as [string, string]] : []),
    ["Preferred Date", data.date],
    ["Preferred Time", data.time],
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Application — Eccentric Digital</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Segoe UI',system-ui,Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#080808;">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:36px 48px 0;background:#0f0f0f;border-radius:20px 20px 0 0;border:1px solid #1e1e1e;border-bottom:none;">
              <p style="margin:0 0 6px;font-size:11px;color:#24eda2;text-transform:uppercase;letter-spacing:2.5px;font-weight:600;">New Project Application</p>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#ffffff;line-height:1.3;">
                ${data.name} wants to work with you
              </h1>
              <p style="margin:0 0 32px;font-size:13px;color:#4b5563;">
                Submitted via eccentricdigital.com
              </p>
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
            <td style="padding:40px 48px;background:#0f0f0f;border:1px solid #1e1e1e;border-top:none;border-bottom:none;">

              <!-- Details table -->
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:28px;margin-bottom:24px;">
                <p style="margin:0 0 18px;font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#374151;font-weight:700;">
                  Applicant Details
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  ${rows
                    .map(
                      ([label, value], i) => `
                  <tr>
                    <td style="padding:11px 0;${i < rows.length - 1 ? "border-bottom:1px solid #161616;" : ""}width:38%;vertical-align:top;">
                      <span style="font-size:12px;color:#4b5563;">${label}</span>
                    </td>
                    <td style="padding:11px 0;${i < rows.length - 1 ? "border-bottom:1px solid #161616;" : ""}vertical-align:top;">
                      <span style="font-size:14px;color:#ffffff;font-weight:600;">${value}</span>
                    </td>
                  </tr>`
                    )
                    .join("")}
                </table>
              </div>

              ${
                data.message
                  ? `<!-- Message -->
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:24px;margin-bottom:24px;">
                <p style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#374151;font-weight:700;">Message</p>
                <p style="margin:0;font-size:14px;color:#9ca3af;line-height:1.75;font-style:italic;">"${data.message}"</p>
              </div>`
                  : ""
              }

              <!-- CTA -->
              <a href="mailto:${data.email}?subject=Re%3A%20Your%20Eccentric%20Digital%20Application&body=Hi%20${encodeURIComponent(data.name)}%2C%0A%0A"
                 style="display:block;text-align:center;padding:15px 32px;background:linear-gradient(90deg,#24eda2,#00a3f8);border-radius:10px;color:#000000;font-weight:700;font-size:15px;text-decoration:none;">
                Reply to ${data.name} →
              </a>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;background:#090909;border:1px solid #1e1e1e;border-top:none;border-radius:0 0 20px 20px;">
              <p style="margin:0;font-size:11px;color:#262626;text-align:center;">
                © ${new Date().getFullYear()} Eccentric Digital — Internal Notification
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `New Application — Eccentric Digital

${data.name} (${data.email}) submitted a consultation request.

Phone: ${data.phone}
Service: ${serviceLabel}
Package: ${data.selectedPackage}
${data.price ? `Price: ${data.price} JMD\n` : ""}Date: ${data.date}
Time: ${data.time}
${data.message ? `\nMessage: ${data.message}` : ""}

Reply: ${data.email}`;

  return { html, text };
}
