import type { Metadata } from "next";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Toaster } from "react-hot-toast";
import AdminNav from "@/components/dashboard/nav/page";
import AdminHeader from "@/components/dashboard/header/page";
import Link from "next/link";
import ToTop from "@/components/footer/toTop/page";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
            <div className="bg-[#FAFBFF]">
                <div className="flex gap-10xs md:gap-71md">
                    <div className="w-306xs md:w-306md">
                        <AdminNav />
                    </div>
                    <div className="flex-1 mt-10xs md:mt-10md mr-10xs md:mr-71md">
                        <AdminHeader />
                        <div className="shadow rounded">{children}</div>
                        <div className="flex justify-center p-30xs md:p-30md">
                            <ToTop />
                            <span className="text-15xs md:text-15md text-gray-700"><Link href='/'>GoUni</Link> Admin &copy; 2024</span>
                        </div>
                    </div>
                </div>

            </div>
            <Toaster />
            <ToastContainer />
        </>

    );
}
