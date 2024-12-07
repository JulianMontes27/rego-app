import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { RouteList } from "@/app/(routes)/dashboard/layout";

import Link from "next/link";
import { Separator } from "../ui/separator";
import UserButton from "../auth/user-button";
import { ModeToggle } from "../themes/theme-toggle";
import { redirect } from "next/navigation";
import getSession from "@/lib/get-session";

export const MobileSidebar = async ({ routes }: { routes: RouteList }) => {
  //check for auth (cached)
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/api/auth/signin");
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col h-full mt-[15px] w-full lg:hidden items-center">
          <div className="flex-1 items-start flex flex-col gap-7 w-full">
            {routes.map((route) => (
              <div className="w-full" key={route.href}>
                <Link href={route.href} className="flex flex-row gap-4">
                  {route.icon}
                  {route.title}
                </Link>
                <Separator />
              </div>
            ))}
          </div>

          <div className="flex items-center w-full justify-center mb-4 gap-4">
            <UserButton user={user} />
            <ModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
