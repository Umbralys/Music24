import type { Metadata, Viewport } from "next";
import { ConditionalClerkProvider } from "@/features/auth/ui/ConditionalClerkProvider";
import { Header } from "@/features/layout/ui/Header";
import { MobileNav } from "@/features/layout/ui/MobileNav";
import { MainLayout } from "@/features/layout/ui/MainLayout";
import { AuthenticatedUser } from "@/features/auth/orchestrators/AuthenticatedUser";
import "./globals.css";

export const metadata: Metadata = {
  title: "Music24 - Hip Hop & R&B Lounge",
  description: "A community for 80s, 90s, and 00s hip hop and R&B enthusiasts",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConditionalClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <MainLayout
            header={<Header userButton={<AuthenticatedUser />} />}
            mobileNav={<MobileNav />}
          >
            {children}
          </MainLayout>
        </body>
      </html>
    </ConditionalClerkProvider>
  );
}
