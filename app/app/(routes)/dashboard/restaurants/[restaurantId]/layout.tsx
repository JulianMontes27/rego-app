import CreateTableButton from "@/components/dashboard/restaurants/create-table-btn";
import { StoreCombobox } from "@/components/dashboard/store-combobox";
import getSession from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

const RestaurantLayout: React.FC<DashboardLayoutProps> = async ({
  children,
}) => {
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
  });
  if (!res) {
    redirect("/");
  }
  return (
    <main className="flex flex-col">
      <div className="flex flex-row bg-white w-full py-4 fixed">
        <StoreCombobox restaurants={res} />
        <CreateTableButton />
      </div>
      <div className="py-10">{children}</div>
    </main>
  );
};

export default RestaurantLayout;
