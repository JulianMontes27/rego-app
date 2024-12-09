import BrandCard from "@/components/dashboard/brands/brand-card-copy";
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
    <div className="w-full ">
      <StoreCombobox restaurants={res} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5  lg:mt-5 mt-3 w-full ">
        {res.map((brand) => (
          <BrandCard brand={brand} key={brand.id} />
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
