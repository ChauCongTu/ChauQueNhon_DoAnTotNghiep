import type { Metadata } from "next";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "Go Uni - Luyện thi hiệu quả",
    description: "gouni.com.vn - Trang web luyện thi THPT Quốc Gia hiệu quả dành cho học sinh.",
};

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            {children}
            <Footer />
            <Toaster />
        </>

    );
}
