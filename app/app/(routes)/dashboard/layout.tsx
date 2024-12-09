import Sidebar from "@/components/dashboard/dashboard-sidebar";
import { User as UserIcon, House, ChefHat, Building2 } from "lucide-react";

import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
interface Route {
  href: string;
  title: string;
  icon: React.ReactNode;
}
export type RouteList = Route[];

export const routes: RouteList = [
  {
    href: `/dashboard`,
    title: "Dashboard",
    icon: <House />,
  },
  {
    href: `/dashboard/brands`,
    title: "Brands",
    icon: <Building2 />,
  },
  {
    href: `/dashboard/stores`,
    title: "Stores",
    icon: <ChefHat />,
  },

  {
    href: `/dashboard/account`,
    title: "Account",
    icon: <UserIcon />,
  },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = async ({
  children,
}) => {
  return (
    <main className="h-full w-full flex flex-row ">
      {/* sidebar desktop */}
      <section className="h-full hidden lg:flex flex-col overflow-x-hidden z-999 w-[75px]">
        <Sidebar routes={routes} />
      </section>
      <section className="flex flex-col w-full  h-full lg:ml-[75px] relative">
        {/* mobile-version */}
        <div className="lg:hidden flex flex-row h-[75px] p-4 w-full fixed top-0  z-999 items-center bg-white">
          <div className="flex flex-row gap-4 bg-white ">
            <MobileSidebar routes={routes} />
            <h1>LOGO</h1>
            
          </div>
          <div className="flex-1 flex justify-end">Data</div>
        </div>
        {/* children of layout */}
        <div className="h-full w-full lg:mt-0 mt-[75px] p-3">{children}</div>
      </section>
    </main>
  );
};

export default DashboardLayout;
