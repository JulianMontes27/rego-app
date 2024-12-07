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

const UpdateRestaurantSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Server name must be at least 2 characters.",
    })
    .optional(),
  location: z.string().min(1, "Location is required").optional(),
  // imgUrl: z
  //   .string()
  //   .min(1, {
  //     message: "Server image is required.",
  //   })
  //   .optional(),
});

type UpdateRestaurantType = z.infer<typeof UpdateRestaurantSchema>;

export default function UpdateRestaurantModal() {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const handleClose = () => {
    onClose();
  };
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<UpdateRestaurantType>({
    resolver: zodResolver(UpdateRestaurantSchema),
    defaultValues: {
      name: "",
      location: "",
      // imgUrl: data.server?.imgUrl,
    },
  });

  // useEffect(() => {
  //   if (data.server) {
  //     form.setValue("imgUrl", data.server.imgUrl);
  //     form.setValue("name", data.server.name);
  //   }
  // }, [data.server, form]);

  // 2. Define a submit handler.
  async function onSubmit(values: UpdateRestaurantType) {
    try {
      await axios
        .patch(`/api/restaurants/${data.restaurant?.id}`, values)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Tus cambios fueron guardados.");
          }
        });
      form.reset();
      router.refresh();
      onClose(); //close modal when everything is udpated.
    } catch (error) {
      console.log(error);
      toast.error("Error. Intenta de nuevo.");
    }
  }

  return (
    <Dialog
      open={isOpen && modalType === "update-restaurant"}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">Ajustes</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-5">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500/90">
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <FileUploader
                        endpoint="serverImage"
                        value={field.value!}
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
                  <FormDescription>El nombre de tu restaurante</FormDescription>
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
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
