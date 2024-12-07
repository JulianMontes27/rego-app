"use client";

import axios from "axios";
import { useState } from "react";

import qs from "query-string";

//mercadopago
import type {
  ICardPaymentBrickPayer,
  ICardPaymentFormData,
} from "@mercadopago/sdk-react/bricks/cardPayment/type";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

import { useSocketContext } from "@/providers/socket-provider";

export default function MercadoPagoCheckout({
  bill_amount,
  bill_id,
}: {
  bill_amount: number;
  bill_id: string;
}) {
  const socket = useSocketContext();
  const [checked, setChecked] = useState(false);
  const [clientPaymentAmount, setclientPaymentAmount] =
    useState<number>(bill_amount); //set the total bill amount as the default state
  const tableuuid = useSearchParams()?.get("tableuuid");

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked); // Update the state with the new checked value
  };
  const handleInputAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setclientPaymentAmount(Number(event.target.value)); // Update the state with the new checked value
  };

  async function handleSubmit(
    data: ICardPaymentFormData<ICardPaymentBrickPayer>
  ) {
    try {
      const url = qs.stringifyUrl({
        url: `/api/socket/pagos`,
        query: {
          tableId: tableuuid,
        },
      });
      //call axios api post request
      await axios.post(url, {
        amount: clientPaymentAmount,
        email: data.payer.email!,
        installments: data.installments,
        token: data.token,
        bill_id,
      });
    } catch (error) {
      console.error("Error during payment submission", error);
      // Display an error message to the user
    }
  }

  useEffect(() => {
    // Initialize the Mercado Pago SDK
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);
    // Cleanup: unmount the component on page leave
    return () => {
      window?.cardPaymentBrickController?.unmount();
    };
  }, []);

  return (
    <div className="max-w-xl">
      {socket.isConnected && (
        <>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckChange}
            className="border-white mb-4"
            id="tableCheckbox"
          />
          <label htmlFor="tableCheckbox" className="m-2">
            Deseas añadir al pago?
          </label>
          <label
            htmlFor="amountInput"
            className={cn("hidden ", checked && "m-2 inline-block")}
          >
            Cuanto deseas pagar?
          </label>
          <input
            type="text"
            className={cn("hidden", checked && "flex text-black")}
            id="amountInput"
            max={bill_amount}
            value={clientPaymentAmount}
            onChange={handleInputAmountChange}
          />

          <div className={cn("hidden", checked && "flex mt-4")}>
            <CardPayment
              customization={{
                paymentMethods: { maxInstallments: 1, minInstallments: 1 },
                visual: {
                  style: {
                    theme: "dark",
                  },
                },
              }}
              initialization={{ amount: clientPaymentAmount }}
              onSubmit={handleSubmit}
            />
          </div>
        </>
      )}
    </div>
  );
}
