import useModalStore from "@/hooks/use-store-modal";
import axios from "axios";
import { useRouter } from "next/navigation";

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
import { Checkbox } from "@/components/ui/checkbox";

const UpdateRestaurantSchema = z.object({
  tableNumber: z.string().min(1).optional(),
  modifyQR: z.boolean().default(false).optional(),
});

type UpdateRestaurantType = z.infer<typeof UpdateRestaurantSchema>;

export default function UpdateTableModal() {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const handleClose = () => {
    onClose();
  };
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<UpdateRestaurantType>({
    resolver: zodResolver(UpdateRestaurantSchema),
    defaultValues: {
      tableNumber: data.table?.tableNumber,
      modifyQR: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UpdateRestaurantType) {
    try {
      const response = await axios.patch(
        `/api/tables/${data.table?.id}`,
        values
      );
      if (response.status === 200) {
        toast.success("Tus cambios fueron guardados.");
      }
      form.reset();
      router.refresh();
      onClose(); // Close modal when everything is updated.
    } catch (error) {
      console.log(error);
      toast.error(
        `Error. Revisa si en la mesa ${data.table?.tableNumber} hay un servicio activo.`
      );
    }
  }

  return (
    <Dialog
      open={isOpen && modalType === "update-table"}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[300px] overflow-hidden rounded-md">
        <DialogHeader className="p-2">
          <DialogTitle className="font-bold text-2xl ">
            Mesa #{data.table?.tableNumber}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="tableNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero de mesa</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder={data.table?.tableNumber}
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>El numero de tu mesa</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modifyQR"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Regenerar código QR</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>El código QR de tu mesa</FormDescription>
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
              Guardar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
