import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SocketProvider } from "@/components/socket-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Textify"
};

export default function RootLayout({ children }) {
  return (
        <html lang="en">
            <body className={inter.className}>
                <SocketProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark">
                        {children}
                    </ThemeProvider>
                </SocketProvider>
            </body>
        </html>
  );
}
