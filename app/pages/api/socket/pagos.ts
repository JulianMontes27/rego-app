import api from "@/app/(routes)/tables/create-payment";
import { NextApiResponseServerIO } from "@/types/types";
import { NextApiRequest } from "next";

//handles a mercado-pago payment
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
      return res.status(405).json({ error: "No Body object." });
    }
    if (!tableId) {
      return res.status(405).json({ error: "No table id object." });
    }
    Object.keys(body).map((key) => {
      if (!body[key]) return res.status(405).json({ error: "No Body object." });
    });

    // Creamos el pago con los datos del brick
    const pago = await api.pago.buy(
      {
        amount: body.amount,
        email: body.email,
        installments: body.installments,
        token: body.token,
      },
      body.bill_id
    );
    //On the server-side, you can send an event to all connected clients or to a subset of clients:
    const tableKey = `table:${tableId}:pagos`;
    //send the client (recever) the socket event (tablekey, pago)
    res?.socket?.server?.io?.emit(tableKey, pago);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log("[PAGOS_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
