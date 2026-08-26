import "./globals.css";
import LayoutWrapper from "@/lib/components/LayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=air,beach_access,deck,free_breakfast,kitchen,local_laundry_service,local_parking,menu_book,person,pool,room_service,shower,sports_esports,star,tv,waves,weekend,wifi"
        />
      </head>
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}