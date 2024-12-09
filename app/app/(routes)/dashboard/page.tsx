import DashboardCard from "@/components/dashboard/home/dashboard-card";
import getSession from "@/lib/get-session";
import prisma from "@/lib/prisma";

import { redirect } from "next/navigation";

const DashboardHomePage = async () => {
  //check for auth (cached)
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin");
  }
  const res = await prisma.brand.findMany({
    where: {
      ownerId: user.id,
    },
    include: {
      stores: true,
    },
  });
  if (!res) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-3">
      <section className="w-full grid grid-cols-1  md:grid-cols-2 gap-3">
      
      </section>
    </div>
  );
};

export default DashboardHomePage;
