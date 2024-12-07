"use client";

import useModalStore from "@/hooks/use-store-modal";
import axios from "axios";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

// import FileUploader from "@/components/file-uploader";

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

const CreateInitialRestaurantFormSchema = z.object({
  name: z.string().min(2, {
    message: "Restaurant name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Restaurant location must be at least 2 characters.",
  }),
  //   imgUrl: z.string().min(1, {
  //     message: "Server image is required.",
  //   }),
});

type CreateInitialRestaurantType = z.infer<
  typeof CreateInitialRestaurantFormSchema
>;

export default function CreateServerModal() {
  //get the current state of the modal provider store
  const { isOpen, onClose, modalType } = useModalStore();
  const router = useRouter();

  const handleClose = () => {
    onClose();
  };

  // 1. Define your form.
  const form = useForm<CreateInitialRestaurantType>({
    resolver: zodResolver(CreateInitialRestaurantFormSchema),
    defaultValues: {
      name: "",
      location: "",
      //   imgUrl: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: CreateInitialRestaurantType) {
    try {
      await axios.post(`/api/restaurants`, values);
      form.reset();
      router.refresh();
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
        open={isOpen && modalType === "create-initial-restaurant"}
        onOpenChange={handleClose}
      >
        <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
          <DialogHeader className="py-3 px-3">
            <DialogTitle className="font-bold text-2xl text-center">
              Crea un Restaurante
            </DialogTitle>
            {/* <DialogDescription className="flex flex-col w-full items-star gap-2">
              <span className="text-[16px] font-semibold ">
                Start working together with other devs!
              </span>
              <span>
                Customize your server. Be sure to make it unique and inviting to
                others!
              </span>
            </DialogDescription> */}
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-5">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <FileUploader
                        endpoint="serverImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your Server&apos;s public image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Mi nuevo restaurante"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      El nombre de tu restaurante
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Calle 1b #1-1"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      La ubicación de tu restaurante
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
                Crear restaurante
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
