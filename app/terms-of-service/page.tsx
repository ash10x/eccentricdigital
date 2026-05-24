import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Eccentric Digital",
  description: "Terms and conditions for using Eccentric Digital's services.",
};

export default function TermsOfServicePage() {
  return (
    <main className="bg-[#060606] text-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-32">
        {/* Header */}
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-4">
            Legal
          </p>
          <h1 className="text-[48px] md:text-[60px] font-black leading-[0.95] tracking-[-0.04em] mb-6">
            Terms of Service
          </h1>
          <p className="text-white/35 text-[15px]">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="space-y-12 text-[15px] text-white/50 leading-relaxed">
          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing our website or engaging our services, you agree to
              be bound by these Terms of Service. If you do not agree to these
              terms, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              2. Services
            </h2>
            <p>
              Eccentric Digital provides web design, development, and digital
              strategy services. The scope, timeline, and deliverables of each
              project are defined in a separate project agreement or proposal
              issued prior to commencement of work.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              3. Payment Terms
            </h2>
            <p className="mb-4">
              All payments are governed by the terms outlined in your project
              agreement. Generally:
            </p>
            <ul className="space-y-2 list-none">
              {[
                "A deposit is required before work begins",
                "Remaining balance is due upon project completion",
                "Late payments may result in project suspension",
                "All fees are non-refundable unless otherwise stated in writing",
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
              4. Intellectual Property
            </h2>
            <p>
              Upon receipt of full payment, all custom design work and code
              produced for your project becomes your property. Eccentric Digital
              retains the right to display completed work in our portfolio unless
              otherwise agreed in writing. Any third-party assets (fonts,
              stock images, plugins) remain subject to their respective licenses.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              5. Client Responsibilities
            </h2>
            <p className="mb-4">You agree to:</p>
            <ul className="space-y-2 list-none">
              {[
                "Provide accurate information and content in a timely manner",
                "Review and approve deliverables within agreed timeframes",
                "Ensure you hold rights to any content you provide to us",
                "Not use our services for unlawful or harmful purposes",
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
              6. Revisions & Scope
            </h2>
            <p>
              Each project includes a defined number of revision rounds as
              specified in your project agreement. Requests that exceed the
              agreed scope or revision limit will be quoted separately and
              require written approval before proceeding.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              7. Limitation of Liability
            </h2>
            <p>
              Eccentric Digital shall not be liable for any indirect, incidental,
              or consequential damages arising from the use of our services or
              website. Our total liability shall not exceed the amount paid for
              the specific service giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              8. Termination
            </h2>
            <p>
              Either party may terminate a project engagement with written
              notice. In the event of termination, you are responsible for
              payment of all work completed to date. Deposits are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              9. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of Jamaica. Any disputes
              shall be resolved through good-faith negotiation, and if necessary,
              binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-white text-[20px] font-bold tracking-[-0.02em] mb-4">
              10. Contact
            </h2>
            <p>
              Questions about these terms? Reach us at{" "}
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
