import TableCard from "@/components/dashboard/tables/table-card";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface RestaurantPageProps {
  params: { restaurantId: string };
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const res = await prisma.restaurant.findFirst({
    where: {
      id: params.restaurantId,
    },
    include: {
      tables: {
        where: {
          deletedAt: null,
        },
        include: {
          bills: true,
        },
      },
    },
  });
  if (!res) {
    return redirect("/");
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {res.tables.map((table) => (
        <TableCard table={table} restaurantId={res.id} key={table.id} />
      ))}
    </section>
  );
};

export default RestaurantPage;
