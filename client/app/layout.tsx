import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Hacker News Feed",
  description: "A modern Hacker News feed interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>
          <Logo href="/" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
