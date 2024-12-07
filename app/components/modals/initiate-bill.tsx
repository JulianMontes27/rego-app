"use client";

import useModalStore from "@/hooks/use-store-modal";
import axios from "axios";

import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import qs from "query-string";

const InitiateBillschema = z.object({
  server: z.string().min(2, {
    message: "Nombre del sirviente debe tener por lo menos 2 caracteres.",
  }),
});

type InitiateBillschemaType = z.infer<typeof InitiateBillschema>;

export default function InitiateBillModal() {
  //get the current state of the modal provider store
  const { isOpen, onClose, modalType, data } = useModalStore();

  const handleClose = () => {
    onClose();
  };

  // 1. Define your form.
  const form = useForm<InitiateBillschemaType>({
    resolver: zodResolver(InitiateBillschema),
    defaultValues: {
      server: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: InitiateBillschemaType) {
    try {
      const url = qs.stringifyUrl({
        url: `/api/socket/bill`,
        query: {
          tableId: data.table?.id,
        },
      });
      // await axios.post(`/api/tables/${data.table?.id}/bills`, values);
      await axios.post(url, values);
      //if res.ok
      form.reset();
      toast.success("Created succesfully.");

      onClose();
    } catch (error) {
      toast.error(`[POST]: ${error}`, {
        position: "bottom-right",
      });
    }
  }

  return (
    <>
      <Dialog
        open={isOpen && modalType === "initiate-bill"}
        onOpenChange={handleClose}
      >
        <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
          <DialogHeader className="py-3 px-3">
            <DialogTitle className="font-bold text-2xl text-center">
              <span className="font-normal">
                Iniciar Servicio: <span className="font-bold">Mesa</span>{" "}
              </span>
              {data.table?.tableNumber}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Pedro Perez"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      El nombre del empleado que atiende la Mesa{" "}
                      {data.table?.tableNumber}.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant={"default"}
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full text-white bg-indigo-500 hover:bg-indigo-500/90"
              >
                Iniciar Servicio
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
