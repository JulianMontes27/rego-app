import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

//create a new Bill
export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      tableId: string;
    };
  }
) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!params.tableId) {
    return new NextResponse("Mesa requerida.", { status: 400 });
  }

  const { tableId } = params;

  const body = await req.json();
  const { server } = body;

  // Find the table
  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: { bills: true },
  });

  if (!table) {
    return new NextResponse("Table not found", { status: 404 });
  }

  // Check if there is already an unpaid bill for this table
  const existingBill = table.bills.find((bill) => !bill.isPaid);

  if (existingBill) {
    return NextResponse.json({
      message: "There is already an active bill for this table.",
      bill: existingBill,
    });
  }

  // Create a new bill for this table
  const newBill = await prisma.bill.create({
    data: {
      tableId: table.id,
      server: server,
      totalAmount: 0, // No orders yet, so total is 0
      isPaid: false, // Bill is unpaid initially
    },
  });

  return NextResponse.json({ message: "New bill created.", bill: newBill });
}
