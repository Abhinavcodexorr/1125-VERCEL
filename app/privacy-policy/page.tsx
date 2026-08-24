import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | 1125 Beach Villa",
  description: "Privacy Policy for 1125 Beach Villa, Kokrobite, Ghana.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FFFEF8] font-sans antialiased text-[#444444] py-12 md:py-20 px-6 sm:px-12 lg:px-16">
      <div className="max-w-[900px] mx-auto bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 md:p-16 shadow-sm">
        
        {/* Header */}
        <div className="border-b border-[#E5D7D7] pb-8 mb-10 text-center sm:text-left">
          <span className="text-[12px] uppercase tracking-[2px] font-bold text-[#6082a4] font-jako-bold block mb-2">
            Legal & Compliance
          </span>
          <h1 className="font-ogg-regular text-[36px] sm:text-[44px] text-[#2C2422] leading-tight font-medium">
            Privacy Policy
          </h1>
          <p className="text-[14px] text-[#5A4F4D] mt-3 font-jako-regular">
            1125 Beach Villa, Kokrobite, Ghana
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-[15px] leading-relaxed text-[#444444] font-jako-regular">
          
          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Introduction
            </h2>
            <p>
              1125 Beach Villa respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our villa or website.
            </p>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Information We Collect
            </h2>
            <p>We may collect:</p>
            <ul className="list-disc list-inside space-y-2 pl-1 text-[#5A4F4D]">
              <li>
                <span className="font-jako-bold text-[#2C2422]">Personal information:</span> name, email, phone number, address, ID/passport details, and payment information.
              </li>
              <li>
                <span className="font-jako-bold text-[#2C2422]">Booking details:</span> stay dates, preferences, and transaction history.
              </li>
              <li>
                <span className="font-jako-bold text-[#2C2422]">Digital information:</span> IP address, device type, and browsing activity on our website.
              </li>
            </ul>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              How We Use Your Information
            </h2>
            <p>Your data is used to:</p>
            <ul className="list-disc list-inside space-y-2 pl-1 text-[#5A4F4D]">
              <li>Process bookings and payments.</li>
              <li>Communicate reservation confirmations and updates.</li>
              <li>Provide personalized services during your stay.</li>
              <li>Improve our website and guest experience.</li>
              <li>Send promotional offers or updates (with your consent).</li>
            </ul>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Data Protection */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Data Protection
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-1 text-[#5A4F4D]">
              <li>Your information is stored securely and accessed only by authorized staff.</li>
              <li>We do not sell, rent, or trade your data with third parties.</li>
              <li>Payment details are encrypted and processed through secure payment gateways.</li>
            </ul>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Third-Party Services */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Third-Party Services
            </h2>
            <p className="text-[#5A4F4D]">
              We may use trusted third-party providers (e.g., payment processors, booking platforms) who adhere to similar data protection standards.
            </p>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Cookies */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Cookies
            </h2>
            <p className="text-[#5A4F4D]">
              Our website may use cookies to enhance browsing experience and analyze traffic. You can disable cookies in your browser settings.
            </p>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Your Rights */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Your Rights
            </h2>
            <p>You may request to:</p>
            <ul className="list-disc list-inside space-y-2 pl-1 text-[#5A4F4D]">
              <li>Access or update your personal data.</li>
              <li>Withdraw consent to marketing communications.</li>
              <li>Request deletion of your information, where legally applicable.</li>
            </ul>
            <p className="pt-2 text-[#5A4F4D]">
              Contact us at{" "}
              <a
                href="mailto:hello@1125beachvilla.com"
                className="text-[#6082a4] underline hover:text-[#2C2422] transition-colors"
              >
                hello@1125beachvilla.com
              </a>{" "}
              for privacy-related requests.
            </p>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Updates */}
          <section className="space-y-3">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Updates
            </h2>
            <p className="text-[#5A4F4D]">
              This policy may be updated periodically. Any changes will be posted on our website with the revised date.
            </p>
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
