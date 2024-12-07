"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import axios from "axios";

import useModalStore from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import toast from "react-hot-toast";

const formSchema = z.object({
  quantity: z.string(),
  price: z.string(),
  name: z.string().min(0),
});

const AddOrderModal = () => {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const router = useRouter();
  const params = useParams();

  if (!params) {
    router.push("/");
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: "",
      price: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(
        `/api/tables/${data.table?.id}/bills/${data?.bill?.id}/orders`,
        values
      );
      form.reset();
      router.refresh();
      toast.success("Orden agregada al Servicio.", {
        position: "top-center",
      });
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error creando tu Orden.");
    }
  }
  return (
    <Dialog open={isOpen && modalType === "add-order"} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-semibold text-2xl">
            <p>Agregar Orden</p> <br />
            <p className="text-[17px]">Mesa #{data.table?.tableNumber}</p>
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de items</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white focus:ring-0 text-black "
                        placeholder="1"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Este es el numero de pedidos en la orden.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white focus:ring-0 text-black "
                        placeholder="1"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Este es el precio (COP) de la Orden.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pedido</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white focus:ring-0 text-black "
                        placeholder="Hamburguesa en combo"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Selecciona el pedido.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className="w-full transform transition-transform duration-300 ease-in-out hover:scale-105 px-4 py-2 text-white rounded bg-blue-900"
                disabled={form.formState.isSubmitting}
              >
                Añadir
              </button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModal;
