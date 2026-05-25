import PaymentPortalClient from "./PaymentPortalClient";

export const metadata = {
  title: "Payment Portal — Eccentric Digital",
  description: "Enter your reference number to view your booking details and complete payment.",
};

export default function PaymentPortalPage() {
  return <PaymentPortalClient />;
}
