import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

import { Preference } from "mercadopago";
import { mercadopago } from "@/lib/init-mercadopago";
import { auth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      tableId: string;
    };
  }
) {
  //invalidate using auth
  //check if the user is authenticated
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const tableId = params.tableId;
  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: {
      bills: {
        where: { isPaid: false }, // Unpaid active bill
        include: { orders: true },
      },
    },
  });
  if (!table || !table.bills.length) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  }
  const bill = table.bills[0]; //active bill

  const orderItems = bill.orders.map((order) => ({
    id: order.id,
    title: order.name,
    quantity: order.quantity,
    unit_price: order.price,
  }));

  const preference = await new Preference(mercadopago).create({
    body: {
      items: orderItems,
      // payer: {
      //   email: "customer-email@example.com", // Get the email from user input or login
      // },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/pay/success?tableId=${tableId}`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pay/failure`,
      },
      auto_return: "approved",
      metadata: {
        tableId: params.tableId,
        bill: bill,
      },
    },
  });
  try {
    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
