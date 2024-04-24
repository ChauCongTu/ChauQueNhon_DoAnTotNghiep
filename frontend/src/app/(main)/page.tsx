import HistorySidebar from "@/components/main/history";
import MainHomePage from "@/components/main/main";
import SwiperExam from "@/components/main/swiper";

export default function Home() {
  return (
    <>
      <div className="mt-40xs md:mt-40md mx-auto px-10xs md:px-40m text-16xs md:text-16md">
        <div className="flex flex-wrap gap-20xs md:gap-20md justify-between">
          <aside className="w-full order-2 md:w-289md md:order-1">
            <div className="mt-20xs md:mt-20md">Menu</div>
          </aside>
          <main className="w-full md:w-745md order-1 md:order-2">
            <MainHomePage />
          </main>
          <nav className="w-full md:w-289md order-3">
            <div>
              <SwiperExam />
            </div>
            <div>
              <HistorySidebar />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
