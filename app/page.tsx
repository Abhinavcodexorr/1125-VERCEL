import Hero from "@/lib/components/home/Hero";
import WhyBookSection from "@/lib/components/home/WhyBookSection";
import ChaletSection from "@/lib/components/home/ChaletSection";
import TourSection from "@/lib/components/home/TourSection";
import StorySection from "@/lib/components/home/StorySection";
import NewsletterSection from "@/lib/components/home/NewsletterSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyBookSection />
      <ChaletSection />
      <StorySection />
      <TourSection />
       <NewsletterSection />
    </>
  );
}