import prisma from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { redirect } from "next/navigation";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

//serve as an API route to handle client payments
const api = {
  pago: {
    //[buy] : key to call the 'buy' payment function
    async buy(
      data: {
        amount: number; //can be the whole amount or a portion
        email: string;
        installments: number;
        token: string;
      },
      activeBillId: string
    ) {
      //first check to see if the Bill is already paid
      const bill = await prisma.bill.findUnique({
        where: {
          id: activeBillId,
          isPaid: false,
        },
      });
      // Check if the bill exists and is not already paid
      if (!bill || bill.isPaid) {
        return redirect("/");
      }
      // Creamos el pago (mercado pago) con los datos del brick
      const payment = await new Payment(mercadopago).create({
        body: {
          payer: {
            email: data.email,
          },
          token: data.token,
          transaction_amount: data.amount,
          installments: data.installments,
          metadata: {
            activeBillId: activeBillId,
          },
        },
      });
      if (payment.status === "approved") {
        if (bill.totalAmount === payment.net_amount) {
          //the whole bill was paid at once, so do not create a Bill share
          await prisma.bill.update({
            where: {
              id: bill?.id,
            },
            data: {
              isPaid: true, // Mark the bill as paid
              paidAmount: payment.net_amount,
            },
          });
          //create the payment from the paid bill
          await prisma.payment.create({
            data: {
              billId: bill.id,
              amount: bill.totalAmount,
              paymentId: payment.id!,
              date_approved: payment.date_approved!,
            },
          });
        } else {
          //this means the client paid a portion of the bill amount
          //create a bill share and update the amount  paid in the bill
          const updatedBill = await prisma.bill.update({
            where: {
              id: activeBillId,
              isPaid: false,
            },
            data: {
              paidAmount: {
                increment: payment.net_amount!, // Increment the paidAmount by the paymentAmount
              },

              //create a bill-share
              billShares: {
                create: {
                  guestId: data.email as string, // Replace with the actual guest ID
                  amount: payment.net_amount!, // The amount paid by this guest
                  paid: true,
                  paidAt: payment.date_approved,
                },
              },
            },
          });
          if (updatedBill.paidAmount === updatedBill.totalAmount) {
            await prisma.bill.update({
              where: {
                id: activeBillId,
                isPaid: false,
              },
              data: {
                isPaid: true,
                payment: {
                  create: {
                    paymentId: payment.id!,
                    amount: updatedBill.totalAmount,
                    date_approved: payment.date_approved!,
                  },
                },
              },
            });
          }
        }
      }

      // Devolvemos el pago
      return payment;
    },
  },
};

export default api;
