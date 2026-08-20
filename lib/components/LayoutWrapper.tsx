"use client";

import { usePathname } from "next/navigation";
import Header from "@/lib/components/common/Header";
import Footer from "@/lib/components/common/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeaderPages = ["/payment", "/thank-you"];
  const hideFooterPages = ["/thank-you"];

  const hideHeader = hideHeaderPages.includes(pathname);
  const hideFooter = hideFooterPages.includes(pathname);

  return (
    <>
      {!hideHeader && <Header />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}