import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

//route handler to create a Brand
export async function POST(req: NextRequest) {
  try {
    //check if the user is authenticated
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, logoUrl } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    //if everything is validated...
    const store = await prisma.brand.create({
      data: {
        name,
        logo: logoUrl ? logoUrl : null,
        ownerId: userId,
      },
    });
    return NextResponse.json(store);
  } catch (err) {
    console.log(err);
    return new NextResponse("There was an error ", { status: 500 });
  }
}
