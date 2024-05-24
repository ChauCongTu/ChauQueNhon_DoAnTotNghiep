import type { Metadata } from "next";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Toaster } from "react-hot-toast";
import AdminNav from "@/components/dashboard/nav/page";
import AdminHeader from "@/components/dashboard/header/page";

export const metadata: Metadata = {
    title: "Go Uni - Luyện thi hiệu quả",
    description: "gouni.com.vn - Trang web luyện thi THPT Quốc Gia hiệu quả dành cho học sinh.",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div>
                <div>
                    <AdminHeader />
                </div>
                <div className="flex gap-10xs md:gap-10md bg-[#ddd]">
                    <div className="w-240xs md:w-240md">
                        <AdminNav />
                    </div>
                    <div className="flex-1 bg-[#ddd] min-h-dvh mt-10xs md:mt-10md">{children}</div>
                </div>
            </div>
        </>

    );
}
