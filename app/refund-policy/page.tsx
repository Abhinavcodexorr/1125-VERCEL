import Link from "next/link";

export const metadata = {
  title: "Refund Policy | 1125 Beach Villa",
  description: "Cancellation & Refund Policy for 1125 Beach Villa, Kokrobite, Ghana.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FFFEF8] font-sans antialiased text-[#444444] py-12 md:py-20 px-6 sm:px-12 lg:px-16">
      <div className="max-w-[900px] mx-auto bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 md:p-16 shadow-sm">
        
        {/* Header */}
        <div className="border-b border-[#E5D7D7] pb-8 mb-10 text-center sm:text-left">
          <span className="text-[12px] uppercase tracking-[2px] font-bold text-[#6082a4] font-jako-bold block mb-2">
            Legal & Compliance
          </span>
          <h1 className="font-ogg-regular text-[36px] sm:text-[44px] text-[#2C2422] leading-tight font-medium">
            Cancellation & Refund Policy
          </h1>
          <p className="text-[14px] text-[#5A4F4D] mt-3 font-jako-regular">
            1125 Beach Villa, Kokrobite, Ghana
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-[15px] leading-relaxed text-[#444444] font-jako-regular">
          
          <section className="space-y-4">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Policy Details
            </h2>
            <ul className="list-disc list-inside space-y-3 text-[#5A4F4D] leading-relaxed">
              <li>
                Cancellations made <span className="font-jako-bold text-[#2C2422]">7 days or more</span> before the scheduled arrival date are eligible for a <span className="font-jako-bold text-[#2C2422]">100% refund</span>.
              </li>
              <li>
                Cancellations made within <span className="font-jako-bold text-[#2C2422]">1-6 days</span> of the arrival date are eligible for a <span className="font-jako-bold text-[#2C2422]">50% refund</span>.
              </li>
              <li>
                Same-day cancellations or no-shows are <span className="font-jako-bold text-[#2C2422]">non-refundable</span>.
              </li>
              <li>
                Changes to reservation dates are subject to availability and management approval.
              </li>
            </ul>
          </section>

          <hr className="border-[#F3E7E7]" />

          {/* Contact */}
          <section className="space-y-3 pt-2">
            <h2 className="text-[20px] font-jako-bold text-[#2C2422] font-semibold">
              Contact Us for Assistance
            </h2>
            <p className="text-[#5A4F4D]">
              If you need to request a cancellation or change your stay dates, please contact our management team:
            </p>
            <div className="text-[#5A4F4D] space-y-1 pt-1">
              <p className="font-jako-bold text-[#2C2422]">1125 Beach Villa</p>
              <p>Kokrobite, Ghana</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@1125beachvilla.com"
                  className="text-[#6082a4] underline hover:text-[#2C2422] transition-colors"
                >
                  info@1125beachvilla.com
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
