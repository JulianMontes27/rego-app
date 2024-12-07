import prisma from "@/lib/prisma";
import CheckoutPage from "./checkout-page";

// Server-side data fetching
const ClientHomePage = async ({
  searchParams,
}: {
  searchParams: {
    tableuuid: string;
  };
}) => {
  const tableWithBill = await prisma.table.findUnique({
    where: {
      id: searchParams.tableuuid,
    },
    include: {
      bills: {
        where: {
          isPaid: false,
        },
        include: { orders: true },
      },
    },
  });
  const bill = tableWithBill?.bills[0];

  return <CheckoutPage bill={bill} />;
};

export default ClientHomePage;
