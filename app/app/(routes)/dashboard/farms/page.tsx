import FarmCard from "@/components/dashboard/farms/farm-card";
import { FarmCombobox } from "@/components/dashboard/farm-combobox";
import getSession from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const DashboardHome = async () => {
  //check for auth (cached)
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin");
  }
  //load the Restaurants passed through props
  const farms = await prisma.farm.findMany({
    where: {
      userId: user.id,
    },
    include: {
      fields: true,
    },
  });

  if (!farms) {
    redirect("/");
  }
  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5  lg:mt-5 mt-3 w-full ">
        {farms.map((farm) => (
          <FarmCard farm={farm} key={farm.id} />
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
