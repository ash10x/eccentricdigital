import type { PaymentEvent } from "./paymentConfirmation";

const EVENT_LABELS: Record<PaymentEvent, { title: string; badge: string; badgeColor: string; badgeBg: string }> = {
  deposit_received: {
    title: "Deposit Received",
    badge: "Deposit",
    badgeColor: "#fbbf24",
    badgeBg: "rgba(251,191,36,0.12)",
  },
  full_payment_received: {
    title: "Full Payment Received",
    badge: "Fully Paid",
    badgeColor: "#24eda2",
    badgeBg: "rgba(36,237,162,0.12)",
  },
  final_payment_received: {
    title: "Final Balance Received",
    badge: "Fully Paid",
    badgeColor: "#24eda2",
    badgeBg: "rgba(36,237,162,0.12)",
  },
};

export function paymentAdminNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  referenceNumber: string;
  service: string;
  selectedPackage: string;
  amountPaid: string;
  totalPrice: string;
  event: PaymentEvent;
}) {
  const meta = EVENT_LABELS[data.event];
  const rows: [string, string][] = [
    ["Reference", `<span style="color:#24eda2;font-weight:700;letter-spacing:1.5px;font-family:monospace;">${data.referenceNumber}</span>`],
    ["Client", data.name],
    ["Email", `<a href="mailto:${data.email}" style="color:#24eda2;text-decoration:none;">${data.email}</a>`],
    ["Phone", `<a href="tel:${data.phone}" style="color:#24eda2;text-decoration:none;">${data.phone}</a>`],
    ["Service", data.service],
    ["Package", data.selectedPackage],
    ["Amount Paid", `<span style="color:${meta.badgeColor};font-weight:700;">${data.amountPaid} JMD</span>`],
    ["Total Price", `${data.totalPrice} JMD`],
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title} — Eccentric Digital</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Segoe UI',system-ui,Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#080808;">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:36px 48px 0;background:#0f0f0f;border-radius:20px 20px 0 0;border:1px solid #1e1e1e;border-bottom:none;">
              <p style="margin:0 0 6px;font-size:11px;color:${meta.badgeColor};text-transform:uppercase;letter-spacing:2.5px;font-weight:600;">Payment Notification</p>
              <h1 style="margin:0 0 4px;font-size:24px;font-weight:800;color:#ffffff;line-height:1.3;">
                ${meta.title}
              </h1>
              <p style="margin:0 0 32px;font-size:13px;color:#4b5563;">
                <span style="display:inline-block;padding:3px 10px;border-radius:999px;background:${meta.badgeBg};border:1px solid ${meta.badgeColor}40;font-size:11px;font-weight:700;color:${meta.badgeColor};letter-spacing:1px;">
                  ${meta.badge}
                </span>
                &nbsp; ${data.name} · Ref ${data.referenceNumber}
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

              <!-- Amount highlight -->
              <div style="background:linear-gradient(135deg,rgba(36,237,162,0.06),rgba(0,163,248,0.06));border:1px solid rgba(36,237,162,0.15);border-radius:14px;padding:22px 28px;margin-bottom:28px;text-align:center;">
                <p style="margin:0 0 4px;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:2.5px;font-weight:600;">Amount Received</p>
                <p style="margin:0;font-size:36px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">${data.amountPaid} <span style="font-size:16px;color:#6b7280;font-weight:600;">JMD</span></p>
              </div>

              <!-- Details table -->
              <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:28px;margin-bottom:24px;">
                <p style="margin:0 0 18px;font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#374151;font-weight:700;">
                  Payment Details
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

              <!-- Reply CTA -->
              <a href="mailto:${data.email}?subject=Re%3A%20Your%20Eccentric%20Digital%20Payment%20%5B${encodeURIComponent(data.referenceNumber)}%5D"
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

  const text = `Payment Notification — Eccentric Digital

${meta.title}

Reference: ${data.referenceNumber}
Client: ${data.name} (${data.email})
Phone: ${data.phone}
Service: ${data.service}
Package: ${data.selectedPackage}
Amount Paid: ${data.amountPaid} JMD
Total Price: ${data.totalPrice} JMD

Reply: ${data.email}`;

  return { html, text, subject: `${meta.title} — ${data.name} [${data.referenceNumber}]` };
}
