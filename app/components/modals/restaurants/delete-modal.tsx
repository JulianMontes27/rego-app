"use client";

import axios from "axios";

import useModalStore from "@/hooks/use-store-modal";

import { useState } from "react";

import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";

export default function DeleteRestaurantModal() {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, modalType, data } = useModalStore();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/restaurants/${data?.restaurant?.id}`);
      router.push("/");
      router.refresh();
      onClose();
      toast(`${data?.restaurant?.id} was deleted.`);
    } catch (error) {
      console.log(error);
      toast.error("Error.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={isOpen && modalType === "delete-restaurant"}
      onOpenChange={onClose}
    >
      <DialogContent
        className="bg-zinc-200 text-black sm:max-w-[425px] overflow-hidden rounded-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Eliminar {data.restaurant?.name}
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2">
            <span className="text-[16px] text-gray-600">
              ¿Estas seguro que quieres eliminar tu{" "}
              <span className="text-rose-400">
                <strong>Restaurante</strong>
              </span>
              ?
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-5">
          <button
            className="w-full transform transition-transform duration-300 ease-in-out hover:scale-110 px-4 py-2 text-black rounded "
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="w-full transform transition-transform duration-300 ease-in-out hover:scale-110 px-4 py-2 text-white rounded bg-rose-600"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Borrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
