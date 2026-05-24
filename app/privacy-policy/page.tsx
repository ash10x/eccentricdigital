import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Eccentric Digital",
  description: "How Eccentric Digital collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#060606] text-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-32">
        {/* Header */}
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-4">
            Legal
          </p>
          <h1 className="text-[48px] md:text-[60px] font-black leading-[0.95] tracking-[-0.04em] mb-6">
            Privacy Policy
          </h1>
          <p className="text-white/35 text-[15px]">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="space-y-12 text-[15px] text-white/50 leading-relaxed">
          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              1. Information We Collect
            </h2>
            <p>
              When you submit a consultation request or contact us through our
              website, we collect the information you provide — including your
              name, email address, and any project details you share. We do not
              collect any data automatically beyond standard server logs.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">
              The information you provide is used exclusively to:
            </p>
            <ul className="space-y-2 list-none">
              {[
                "Respond to your consultation requests and inquiries",
                "Schedule and manage project consultations",
                "Send you project updates and relevant communications",
                "Improve our services based on your feedback",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#24eda2]/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              3. Data Sharing
            </h2>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. Your data may be shared with trusted service providers
              (email delivery, database hosting) solely to operate our services,
              and they are contractually bound to keep it confidential.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              4. Data Retention
            </h2>
            <p>
              We retain your information for as long as necessary to fulfill the
              purposes outlined in this policy or as required by law. You may
              request deletion of your data at any time by contacting us
              directly.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              5. Cookies
            </h2>
            <p>
              Our website does not use tracking cookies or third-party analytics
              tools. We may use essential session data to maintain basic website
              functionality.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete any personal
              information we hold about you. To exercise these rights, contact
              us at{" "}
              <a
                href="mailto:support@eccentricdigital.com"
                className="text-[#24eda2] hover:underline"
              >
                support@eccentricdigital.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Any changes will be
              posted on this page with an updated date. Continued use of our
              website constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              8. Contact
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please reach
              out at{" "}
              <a
                href="mailto:support@eccentricdigital.com"
                className="text-[#24eda2] hover:underline"
              >
                support@eccentricdigital.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link
            href="/"
            className="text-[13px] text-white/30 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
