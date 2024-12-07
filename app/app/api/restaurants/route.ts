import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

//route handler to create a Restaurant
export async function POST(req: NextRequest) {
  try {
    //check if the user is authenticated
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, location } = body;

    if (!name) {
      return new NextResponse("Title is required", { status: 400 });
    }
    //if everything is validated...
    const store = await prisma.restaurant.create({
      data: {
        name,
        location,
        ownerId: userId,
      },
    });
    return NextResponse.json(store);
    //if promise is rejected
  } catch (err) {
    console.log(err);
    return new NextResponse("There was an error ", { status: 500 });
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const res = await prisma.restaurant.findMany();
//     return NextResponse.json(res);
//   } catch (error) {
//     console.log(error);
//   }
// }
