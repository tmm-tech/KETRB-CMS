import { Navbar } from "@/components/Navigation/Navbar";
import { MainSection } from "@/components/Section/MainSection";
import { SideNav } from "@/components/Navigation/SideNav";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNav />
      <div className="flex-grow">
        <Navbar />
        <MainSection>
          {children}
        </MainSection>
      </div>
    </div>
  );
}
