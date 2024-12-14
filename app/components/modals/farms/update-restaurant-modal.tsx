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
import { useEffect } from "react";
import FileUploader from "@/components/file-uploads/file-uploader";

const UpdateBrandSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Brand name must be at least 2 characters.",
    })
    .optional(),

  logo: z
    .string()
    .min(1, {
      message: "Logo is required.",
    })
    .optional(),
});

type UpdateBrandType = z.infer<typeof UpdateBrandSchema>;

export default function UpdateRestaurantModal() {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const handleClose = () => {
    onClose();
  };
  const router = useRouter();

  const form = useForm<UpdateBrandType>({
    resolver: zodResolver(UpdateBrandSchema),
    defaultValues: {
      name: "",
      logo: data?.brand?.logo ? data.brand.logo : "",
    },
  });

  useEffect(() => {
    if (data.brand) {
      form.setValue("logo", data.brand.logo ? data.brand.logo : "");
      form.setValue("name", data.brand.name);
    }
  }, [data.brand, form]);

  // 2. Define a submit handler.
  async function onSubmit(values: UpdateBrandType) {
    try {
      await axios.patch(`/api/brands/${data.brand?.id}`, values).then((res) => {
        if (res.status === 200) {
          toast.success("Changes saved succesfully.");
        }
      });
      form.reset();
      router.refresh();
      onClose(); //close modal when everything is udpated.
    } catch (error) {
      console.log(error);
      toast.error("There was an error.");
    }
  }

  return (
    <Dialog
      open={isOpen && modalType === "update-brand"}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">Ajustes</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-5">
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500/90">
                    Brand Logo
                  </FormLabel>
                  <FormControl>
                    <FileUploader
                      endpoint="brandLogoImage"
                      value={field.value!}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your Brand&apos;s logo image.
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
