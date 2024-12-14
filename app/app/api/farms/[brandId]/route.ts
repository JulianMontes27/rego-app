import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      brandId: string;
    };
  }
) {
  const session = await auth();
  const user = session?.user;

  console.log(params.brandId);

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { name, logo } = body;

  try {
    const res = await prisma.brand.update({
      where: {
        id: params.brandId,
      },
      data: {
        name,
        logo,
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
  { params }: { params: { brandId: string } }
) {
  //check to see if the browser requesting has the User auth cookies
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!params.brandId)
    return new NextResponse("BrandId is required", { status: 500 });

  try {
    /* TODO = CHECK TO SEE IF A BRAND HAS AN ACTIVE ORDER */
    // // If no active bills, proceed to delete the restaurant
    const res = await prisma.brand.delete({
      where: { id: params.brandId },
    });

    return NextResponse.json({ res });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error.", { status: 400 });
  }
}
