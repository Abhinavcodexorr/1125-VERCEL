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

  const hideLayoutPages = ["/payment"];

  const hideLayout = hideLayoutPages.includes(pathname);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}