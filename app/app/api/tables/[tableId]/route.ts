import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import QRCode from "qrcode"; // Import the QR code library

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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

  const body = await req.json();
  const { tableNumber, modifyQR } = body;

  let qrCodeUrl;

  //if User decided to regen QR code
  if (modifyQR === true) {
    // Generate new QR code
    qrCodeUrl = await QRCode.toDataURL(
      `https://pater-montes-app.vercel.app/tables?tableuuid=${params.tableId}`,
      {
        errorCorrectionLevel: "H",
        type: "image/png",
      }
    );
  }

  //check to see if there is an active bill in the Table
  const activeBill = await prisma.bill.findFirst({
    where: {
      tableId: params.tableId, // Replace with the actual table ID
      isPaid: false, // Look for unpaid bills
    },
  });
  if (activeBill)
    return new NextResponse("La mesa tiene un servicio activo.", {
      status: 500,
    });

  try {
    if (modifyQR && !activeBill) {
      const res = await prisma.table.update({
        where: {
          id: params.tableId,
        },
        data: {
          qrCodeUrl,
        },
      });
      return NextResponse.json(res);
    } else {
      const res = await prisma.table.update({
        where: {
          id: params.tableId,
        },
        data: {
          tableNumber,
        },
      });
      return NextResponse.json(res);
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { tableId: string } }
) {
  //check to see if the browser requesting has the User auth cookies
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!params.tableId)
    return new NextResponse("Table Id is required", { status: 500 });

  try {
    // Query to check if any table in the restaurant has unpaid bills
    const activeBill = await prisma.table.findFirst({
      where: {
        id: params.tableId, // Filter tables belonging to the specified restaurant
        bills: {
          some: {
            isPaid: false, // Only check for unpaid (active) bills
          },
        },
      },
    });
    // If any active bill is found, respond with a message preventing deletion
    if (activeBill) {
      return new NextResponse("La mesa tiene un servicio activo.", {
        status: 500,
      });
    }
    // // If no active bills, proceed to SOFT delete the Table and its Bills (archive it)
    const res = await prisma.table.update({
      where: {
        id: params.tableId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return NextResponse.json({ res });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
