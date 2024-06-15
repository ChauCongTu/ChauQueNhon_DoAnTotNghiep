'use client'
import HistorySidebar from "@/components/main/history";
import MainHomePage from "@/components/main/main";
import SwiperExam from "@/components/main/swiper";
import TargetSidebar from "@/components/target/sidebar";
import { useAuth } from "@/providers/authProvider";

export default function Home() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <div className="mt-20xs md:mt-20md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
        <div className="flex flex-wrap gap-20xs md:gap-20md justify-between">
          <aside className="w-full md:w-280md">
            <TargetSidebar />
          </aside>
          <main className="w-full flex-1 order-1 md:order-2 md:max-w-720md">
            <MainHomePage />
          </main>
          <nav className="w-full hidden md:flex md:w-310md order-3">
            <div className="w-full">
              <div>
                <SwiperExam />
              </div>
              <div className="mt-12xs md:mt-16md">
                {
                  isLoggedIn && <HistorySidebar />
                }
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
