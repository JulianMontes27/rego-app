"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModalStore from "@/hooks/use-store-modal";

const ShowOrdersModal = () => {
  const { isOpen, onClose, modalType, data } = useModalStore();

  const formattedAmount = new Intl.NumberFormat("es-Co", {
    style: "currency",
    currency: "COP",
  });

  return (
    <Dialog open={isOpen && modalType === "show-orders"} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-semibold text-2xl">
            Órdenes <br />
            <p className="text-[17px]"></p>
          </DialogTitle>
        </DialogHeader>
        <ul>
          {data.orders?.map((order, index) => (
            <li key={order.id}>
              {index + 1}.<span> {formattedAmount.format(order.price)}</span>(
              {order.quantity})
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default ShowOrdersModal;
