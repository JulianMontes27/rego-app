// import { DashboardAlert } from "@/components/dashboard/home/dashboard-active-section";
import RestaurantCard from "@/components/dashboard/restaurants/restaurant-card copy";
import { StoreCombobox } from "@/components/dashboard/store-combobox";
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
  const res = await prisma.restaurant.findMany({
    where: {
      ownerId: user.id,
    },
    include: {
      tables: {
        where: {
          deletedAt: null,
        },
        include: {
          bills: {
            where: {
              isPaid: false,
            },
          },
        },
      },
    },
  });

  if (!res) {
    redirect("/");
  }
  return (
    <div className="w-full ">
      <StoreCombobox restaurants={res} />
      {/* <DashboardAlert res={res} /> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5  lg:mt-5 mt-3 w-full ">
        {res.map((restaurant) => (
          <RestaurantCard restaurant={restaurant} key={restaurant.id} />
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
