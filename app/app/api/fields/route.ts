import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

// API route handler for creating a Field
export async function POST(req: NextRequest) {
  // Check for authentication
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const farmId = searchParams.get("farmId");
  if (!farmId) {
    return new NextResponse("[FIELDS: POST]: Field ID required.", {
      status: 400,
    });
  }

  // Get the table number submitted by the admin
  const body = await req.json();
  const { name, size, cropType } = body;

  if (!name) {
    return new NextResponse("[FIELDS: POST]: Name is required.", {
      status: 400,
    });
  }
  if (!size) {
    return new NextResponse("[FIELDS: POST]: Size number is required.", {
      status: 400,
    });
  }
  if (!cropType) {
    return new NextResponse("[FIELDS: POST]: Crop_size number is required.", {
      status: 400,
    });
  }

  // Check if the user owns the restaurant
  const farmByUserId = await prisma.farm.findUnique({
    where: {
      userId: user.id,
      id: farmId,
    },
  });
  if (!farmByUserId) {
    return new NextResponse("Unauthorized restaurant access.", { status: 403 });
  }

  try {
    // Create a new field
    const field = await prisma.field.create({
      data: {
        name,
        farmId,
        cropType,
      },
    });

    // Return the updated table, including the QR code
    return NextResponse.json(field);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error creating table.", { status: 500 });
  }
}
