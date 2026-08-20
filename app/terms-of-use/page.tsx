import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | 1125 Beach Villa",
  description: "Terms and Conditions for 1125 Beach Villa, Kokrobite, Ghana.",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-[#FFFEF8] font-sans antialiased text-[#444444] py-12 md:py-20 px-6 sm:px-12 lg:px-16">
      <div className="max-w-[900px] mx-auto bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 md:p-16 shadow-sm">
        
        {/* Header */}
        <div className="border-b border-[#E5D7D7] pb-8 mb-10 text-center sm:text-left">
          <span className="text-[12px] uppercase tracking-[2px] font-bold text-[#6082a4] font-jako-bold block mb-2">
            Legal & Compliance
          </span>
          <h1 className="font-ogg-regular text-[36px] sm:text-[44px] text-[#2C2422] leading-tight font-medium">
            Terms & Conditions
          </h1>
          <p className="text-[14px] text-[#5A4F4D] mt-3 font-jako-regular">
            1125 Beach Villa, Kokrobite, Ghana
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-[15px] leading-relaxed text-[#444444] font-jako-regular">
          
          {/* Overview */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Overview
            </h2>
            <p>
              Welcome to 1125 Beach Villa (“the Villa”, “we”, “us”, or “our”). By making a booking, accessing our premises, or using our website, you agree to these Terms & Conditions. Please read them carefully before confirming your reservation.
            </p>
            <p>
              These Terms & Conditions apply to all guests staying at or visiting the Villa.
            </p>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Booking Policy */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Booking Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-1 text-[#5A4F4D]">
              <li>All bookings are subject to availability and confirmation by the Villa.</li>
              <li>A valid government-issued photo ID is required at check-in for all guests.</li>
              <li>Full payment (100%) is required to confirm and secure your reservation unless otherwise agreed in writing.</li>
              <li>Rates are quoted in Ghanaian Cedi (GHS) and include applicable taxes unless otherwise stated.</li>
              <li>Check-in: 2:00 PM</li>
              <li>Check-out: 12:00 PM</li>
              <li>Early check-in and late check-out are subject to availability and may incur additional charges.</li>
            </ul>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Cancellation & Refund Policy */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Cancellation & Refund Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-1 text-[#5A4F4D]">
              <li>Cancellations made 7 days or more before the scheduled arrival date are eligible for a 100% refund.</li>
              <li>Cancellations made within 1-6 days of the arrival date are eligible for a 50% refund.</li>
              <li>Same-day cancellations or no-shows are non-refundable.</li>
              <li>Changes to reservation dates are subject to availability and management approval.</li>
            </ul>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Villa Rules */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Villa Rules
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-1 text-[#5A4F4D]">
              <li>Guests are expected to behave respectfully toward staff, neighbors, property, and fellow guests.</li>
              <li>Outside food and beverages may be permitted unless otherwise restricted for private events or special packages.</li>
              <li>Smoking is permitted only in designated outdoor areas.</li>
              <li>The Villa is not responsible for the loss, theft, or damage of guests&apos; personal belongings.</li>
              <li>Management reserves the right to refuse service or require any guest to leave the premises if these Terms & Conditions are violated, without refund where applicable.</li>
              <li>Vehicles are parked at the owner&apos;s risk unless otherwise required by law.</li>
            </ul>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Activities & Safety */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Activities & Safety
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-1 text-[#5A4F4D]">
              <li>The Villa is located on the seafront. Weather conditions, tides, sea conditions, and local events are beyond the Villa&apos;s control.</li>
              <li>Guests should exercise caution while near the shoreline and supervise children at all times.</li>
              <li>The Villa accepts no responsibility for activities undertaken on the beach or in the sea.</li>
            </ul>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Liability */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Liability
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-1 text-[#5A4F4D]">
              <li>1125 Beach Villa shall not be liable for any injury, loss, damage, accident, delay, or inconvenience arising from causes beyond its reasonable control, including but not limited to weather conditions, natural disasters, government actions, or public utility interruptions.</li>
              <li>Guests are responsible for any loss or damage caused to the Villa, its furnishings, equipment, or other property during their stay and may be charged for repairs or replacements where applicable.</li>
            </ul>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Force Majeure */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Force Majeure
            </h2>
            <p className="text-[#5A4F4D]">
              The Villa shall not be liable for failure to perform its obligations due to events beyond its reasonable control, including severe weather, natural disasters, government restrictions, utility failures, or other unforeseen circumstances.
            </p>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Governing Law */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Governing Law
            </h2>
            <p className="text-[#5A4F4D]">
              These Terms & Conditions shall be governed by and construed in accordance with the laws of the Republic of Ghana. Any disputes arising out of or relating to these Terms & Conditions shall be subject to the exclusive jurisdiction of the courts of Ghana.
            </p>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Contact Information */}
          <section className="space-y-3 pt-2">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Contact Information
            </h2>
            <div className="text-[#5A4F4D] space-y-1">
              <p className="font-jako-bold text-[#2C2422]">1125 Beach Villa</p>
              <p>Kokrobite, Ghana</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:hello@1125beachvilla.com"
                  className="text-[#6082a4] underline hover:text-[#2C2422] transition-colors"
                >
                  hello@1125beachvilla.com
                </a>
              </p>
            </div>
          </section>

        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-[#E5D7D7] flex justify-between items-center">
          <Link
            href="/"
            className="text-[14px] font-jako-bold text-[#6082a4] hover:text-[#AF2F2C] transition-colors flex items-center gap-1"
          >
            ‹ Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
