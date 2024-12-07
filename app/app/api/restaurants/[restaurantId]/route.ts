import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      restaurantId: string;
    };
  }
) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { name, location } = body;

  try {
    const res = await prisma.restaurant.update({
      where: {
        id: params.restaurantId,
      },
      data: {
        name,
        location,
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  //check to see if the browser requesting has the User auth cookies
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!params.restaurantId)
    return new NextResponse("Restaurant Id is required", { status: 500 });

  try {
    // Query to check if any table in the restaurant has unpaid bills
    const activeBill = await prisma.table.findFirst({
      where: {
        restaurantId: params.restaurantId, // Filter tables belonging to the specified restaurant
        bills: {
          some: {
            isPaid: false, // Only check for unpaid (active) bills
          },
        },
      },
      select: { id: true, tableNumber: true }, // Only return the table's ID if an unpaid bill is found
    });

    // If any active bill is found, respond with a message preventing deletion
    if (activeBill) {
      return new NextResponse(
        "Cannot delete restaurant because there are active bills associated with it.",
        { status: 400 }
      );
    }

    // // If no active bills, proceed to delete the restaurant
    const res = await prisma.restaurant.delete({
      where: { id: params.restaurantId },
    });

    return NextResponse.json({ res });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      "Cannot delete restaurant because there are active bills associated with it.",
      { status: 400 }
    );
  }
}
