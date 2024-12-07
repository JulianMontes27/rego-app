import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      restaurantId: string;
      tableId: string;
    };
  }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: params.restaurantId, // Restaurant ID provided
      },
      include: {
        tables: {
          where: {
            id: params.tableId, // Table ID provided
          },
          include: {
            bills: {
              include: {
                orders: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(restaurant);
  } catch (error) {
    console.log(error);
    return new NextResponse("Error fetching restaurants.", { status: 500 });
  }
}
