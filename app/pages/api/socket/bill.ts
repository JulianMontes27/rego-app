import { NextApiResponseServerIO } from "@/types/types";
import { NextApiRequest } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = req.body;
    const { tableId } = req.query;

    if (!body) {
      return res.status(400).json({ error: "No body object provided." });
    }

    if (!tableId) {
      return res.status(400).json({ error: "No table ID provided." });
    }

    // Find the table
    const table = await prisma.table.findUnique({
      where: { id: tableId as string },
      include: { bills: true },
    });

    if (!table) {
      return res.status(404).json({ error: "Table not found." });
    }

    // Check if there is already an unpaid bill for this table
    const existingBill = table.bills.find((bill) => !bill.isPaid);

    if (existingBill) {
      return res.status(400).json({
        message: "There is already an active bill for this table.",
      });
    }

    // Create a new bill for this table
    const newBill = await prisma.bill.create({
      data: {
        tableId: table.id,
        server: body.server,
        totalAmount: 0,
        isPaid: false,
      },
    });

    // Define the socket event key for new bills
    const newBillKey = `table:${tableId}:new-bill`;

    // Emit the new bill event with the created bill details
    res.socket?.server?.io?.emit(newBillKey, newBill);

    return res.status(200).json(newBill);
  } catch (error) {
    console.error("[NEW_BILL_POST]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
