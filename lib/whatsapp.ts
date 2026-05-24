const serviceLabels: Record<string, string> = {
  "custom-design": "Custom Web Design",
  ecommerce: "E-commerce Website",
  maintenance: "Website Maintenance",
  remodeling: "Website Remodel",
};

export async function sendWhatsAppNotification(data: {
  name: string;
  email: string;
  service: string;
  selectedPackage: string;
  date: string;
  time: string;
  message?: string;
}) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey) {
    console.warn("CallMeBot env vars not configured — skipping WhatsApp notification.");
    return;
  }

  const text = [
    `New Consultation Request`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Service: ${serviceLabels[data.service] ?? data.service}`,
    `Package: ${data.selectedPackage}`,
    `Date: ${data.date} at ${data.time}`,
    data.message ? `Notes: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`CallMeBot error: ${res.status} ${res.statusText}`);
  }
}
