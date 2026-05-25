import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "Nextport AI — Import Compliance Control Tower",
  description:
    "AI-powered control tower for Mexican import operations and trade compliance. Classify documents, detect exceptions, and get pedimento-ready.",
};

// Run before React hydration so the chosen theme is applied to <html> before
// first paint — avoids a flash of the wrong palette.
const themeInitScript = `
(function(){try{var t=localStorage.getItem("np_theme");var l=t==="light";document.documentElement.classList.add(l?"theme-light":"theme-dark");document.documentElement.style.colorScheme=l?"light":"dark";}catch(e){}})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="theme-dark" style={{ colorScheme: "dark" }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
