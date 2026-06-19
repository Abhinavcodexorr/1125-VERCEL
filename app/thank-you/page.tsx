import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Thank You | 1125 Beach Villa",
  description:
    "Your reservation at 1125 Beach Villa has been confirmed. We look forward to welcoming you.",
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#FFFEF8] font-sans antialiased text-[#444444] flex items-center justify-center px-4 sm:px-8 py-12 md:py-16">
      <div className="w-full max-w-[920px] text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#00C950]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="#FFFEF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="font-ogg-regular text-[#2C2422] text-[32px] sm:text-[40px] font-[500] leading-tight tracking-wide">
          Thank You for Your Reservation!
        </h1>

        <p className="mt-4 text-[15px] sm:text-[16px] text-[#6B6B6B] font-jako-regular leading-relaxed max-w-[640px] mx-auto">
          Your booking has been successfully completed. We&apos;ve sent a
          confirmation email with all the details of your stay at our villas,
          chalets, and rooms.
        </p>

        <div className="mt-10 bg-white rounded-2xl border border-[#E7DDD4] shadow-sm overflow-hidden text-left">
          <div className="grid md:grid-cols-2 gap-0 items-stretch">
            <div className="relative min-h-[240px] md:min-h-[320px] bg-[#f9f8f6]">
              <Image
                src="/images/hero.jpg"
                alt="1125 Beach Villa oceanfront stay"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 460px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center px-6 sm:px-8 py-8 md:py-10">
              <h2 className="font-ogg-regular text-[#2C2422] text-[24px] sm:text-[28px] font-[500] leading-snug">
                Your escape awaits 🌴
              </h2>
              <p className="mt-4 text-[15px] sm:text-[16px] text-[#6B6B6B] font-jako-regular leading-relaxed">
                Relax and enjoy your time at 1125 Beach Villa. Whether you
                chose a villa, chalet, or room, we look forward to welcoming
                you soon!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/accommodations"
            className="w-full sm:w-auto min-w-[220px] h-[52px] px-8 rounded-full border border-[#2C2422] bg-white text-[#2C2422] text-[14px] font-jako-bold tracking-[1px] uppercase transition-colors hover:bg-[#FFFEF8] inline-flex items-center justify-center"
          >
            Explore More Stays
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto min-w-[220px] h-[52px] px-8 rounded-full bg-[#BC2623] text-white text-[14px] font-jako-bold tracking-[1px] uppercase transition-colors hover:bg-[#A92320] inline-flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
