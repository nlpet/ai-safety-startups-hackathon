import { PT_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import "./globals.css";

const font = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Ælign",
  description: "Multi-Agent Collaboration Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
