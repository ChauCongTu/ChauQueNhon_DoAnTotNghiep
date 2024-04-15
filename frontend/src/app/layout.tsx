import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/authProvider";
import { Toaster } from "react-hot-toast";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Providers from "@/providers/progressProvider";

export const metadata: Metadata = {
  title: "Go Uni - Luyện thi hiệu quả",
  description: "gouni.com.vn - Trang web luyện thi THPT Quốc Gia hiệu quả dành cho học sinh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="vi">
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </AuthProvider >

  );
}
