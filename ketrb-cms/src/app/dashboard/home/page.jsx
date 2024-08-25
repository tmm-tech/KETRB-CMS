import { SideNav } from "@/components/Navigation/sidenav";
import { Navbar } from "@/components/Navigation/navbar";
import { MainSection } from "@/components/Section/MainSection";
export function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Navbar />
        <MainSection />
      </div>
    </div>
  );
}

