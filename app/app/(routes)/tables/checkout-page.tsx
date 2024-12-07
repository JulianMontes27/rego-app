"use client";

import React, { useEffect, useState } from "react";
import { useSocketContext } from "@/providers/socket-provider";
import { notFound, useSearchParams } from "next/navigation";
import MercadoPagoCheckout from "./mercadopago-checkout";
import { Bill, Order } from "@prisma/client";

const CheckoutPage = ({
  bill,
}: {
  bill: (Bill & { orders: Order[] }) | undefined;
}) => {
  const { socket } = useSocketContext();
  const [billData, setBillData] = useState(bill);

  const searchParams = useSearchParams();
  const tableuuid = searchParams?.get("tableuuid");

  // Run this only if `socket` and `tableuuid` are available
  useEffect(() => {
    if (!socket || !tableuuid) return;

    const handlePaymentUpdate = async (paymentData: {
      metadata: { active_bill_id: string };
    }) => {
      const { metadata } = paymentData;
      if (metadata.active_bill_id === billData?.id) {
        const updatedBill = await fetch(
          `/api/tables/${tableuuid}/bills/${metadata.active_bill_id}`
        );
        const data = await updatedBill.json();
        setBillData(data);
      }
    };

    socket.on(`table:${tableuuid}:pagos`, handlePaymentUpdate);

    // Cleanup on unmount
    return () => {
      socket.off(`table:${tableuuid}:pagos`, handlePaymentUpdate);
    };
  }, [socket, tableuuid, billData?.id]);

  // Moved all conditional returns below the hooks
  if (!searchParams) return notFound();
  if (!tableuuid) return notFound();
  if (!bill) {
    return <div>No hay servicio para pagar.</div>;
  }
  if (billData?.totalAmount === billData?.paidAmount) {
    return (
      <section className="relative h-full">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
        <div className="h-full w-full flex-col items-center text-white justify-center flex ">
          <h1 className="md:text-4xl text-xl">¡Hemos recibido el pago!</h1>
          <p>Ya puedes cerrar esta ventana.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="h-screen w-full flex flex-col items-center justify-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] text-white p-4">
      <p className="md:text-6xl font-bold text-xl text-white">
        ¡GRACIAS POR VENIR!
      </p>
      <p className="mt-4 flex flex-row justify-center items-center">
        Total a pagar:{" "}
        <span className="font-bold ml-2">
          {billData && <>${billData?.totalAmount - billData?.paidAmount}</>}
        </span>
      </p>
      <ul>
        {billData?.orders.map((order: Order, index: number) => (
          <li className="flex flex-row gap-2" key={order.id}>
            <span className="font-bold">{index + 1}.</span>$
            {order.price * order.quantity}
          </li>
        ))}
      </ul>
      {billData && (
        <MercadoPagoCheckout
          bill_amount={billData?.totalAmount - billData?.paidAmount}
          bill_id={billData?.id}
        />
      )}
    </section>
  );
};

export default CheckoutPage;
