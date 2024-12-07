import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      billId: string;
    };
  }
) {
  //authenticate the User
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { billId } = params;
  const body = await req.json();
  let { quantity, price } = body;
  const { name } = body;

  if (!name || !quantity || !price) {
    return new NextResponse("Missing order details", { status: 400 });
  }
  //turn strings into ints
  quantity = +quantity;
  price = +price;

  // Find the bill
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: { orders: true }, // Include existing orders for totalAmount update
  });

  if (!bill) {
    return new NextResponse("Bill not found", { status: 404 });
  }

  if (bill.isPaid) {
    return new NextResponse("Cannot add orders to a paid bill", {
      status: 400,
    });
  }

  // Add the new order
  const order = await prisma.order.create({
    data: {
      name,
      quantity,
      price,
      bill: {
        connect: {
          id: billId, // Connect the order to the specific Bill
        },
      },
    },
  });

  // Update total amount in the bill
  const totalAmount = bill.totalAmount + price * quantity;

  await prisma.bill.update({
    where: { id: bill.id },
    data: { totalAmount },
  });

  return NextResponse.json({
    message: "Order added successfully",
    order: order,
    totalAmount,
  });
}

