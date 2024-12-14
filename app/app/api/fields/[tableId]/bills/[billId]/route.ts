import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      billId: string;
    };
  }
) {
  try {
    const billId = params.billId;
    if (!billId) {
      return new NextResponse("BillId missing", { status: 400 });
    }
    const bill = await prisma.bill.findUnique({
      where: {
        id: billId,
      },
      include: {
        orders: true,
      },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}
