import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

// API route handler for CREATING Table
export async function POST(req: NextRequest) {
  // Check for authentication
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");
  if (!restaurantId) {
    return new NextResponse("[TABLES: POST]: Restaurant ID required.", {
      status: 400,
    });
  }

  // Get the table number submitted by the admin
  const body = await req.json();
  const { tableNumber } = body;

  if (!tableNumber) {
    return new NextResponse("[TABLES: POST]: Table number is required.", {
      status: 400,
    });
  }

  // Check if the user owns the restaurant
  const restaurantByUserId = await prisma.restaurant.findUnique({
    where: {
      ownerId: user.id,
      id: restaurantId,
    },
  });
  if (!restaurantByUserId) {
    return new NextResponse("Unauthorized restaurant access.", { status: 403 });
  }

  // Check if a table with the same number already exists in this restaurant
  const existingTable = await prisma.table.findFirst({
    where: {
      restaurantId,
      tableNumber,
    },
  });

  if (existingTable) {
    return new NextResponse("[TABLES: POST]: Table number already exists.", {
      status: 409, // Conflict
    });
  }

  try {
    // Create a new table
    const table = await prisma.table.create({
      data: {
        id: uuidv4(),
        restaurantId,
        tableNumber,
        deletedAt: null,
      },
    });

    // Generate a QR code based on the table's unique URL (e.g., for billing)
    // const qrCodeUrl = await QRCode.toDataURL(
    //   `https://pater-montes-app.vercel.app/tables?tableuuid=${table.id}`
    // );

    const qrCodeUrl = await QRCode.toDataURL(
      `http://localhost:3000/tables?tableuuid=${table.id}`
    );

    // Update the table record with the generated QR code URL
    const updatedTable = await prisma.table.update({
      where: { id: table.id },
      data: { qrCodeUrl },
    });

    // Return the updated table, including the QR code
    return NextResponse.json(updatedTable);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error creating table.", { status: 500 });
  }
}
