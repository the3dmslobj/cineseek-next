import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Cineseek",
  description: "Browse trending movies and TV shows powered by TMDB.",
  icons: { icon: "/cineseek-logo-black.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="max-w-7xl mx-auto">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
