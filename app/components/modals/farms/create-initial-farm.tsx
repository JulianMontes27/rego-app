"use client";

import useModalStore from "@/hooks/use-store-modal";
import axios from "axios";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import FileUploader from "@/components/file-uploads/file-uploader";

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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreateInitialFarmModalSchema = z.object({
  name: z.string().min(2, {
    message: "Farm name must be at least 2 characters.",
  }),
  size: z.string().min(1, {
    message: "Server image is required.",
  }),
  location: z.string().min(1, {
    message: "Must be a city, address, or postal code.",
  }),
});

type CreateFarmFormType = z.infer<typeof CreateInitialFarmModalSchema>;

export default function CreateInitialFarmModal() {
  const { isOpen, onClose, modalType } = useModalStore();
  const handleClose = () => {
    onClose();
  };
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<CreateFarmFormType>({
    resolver: zodResolver(CreateInitialFarmModalSchema),
    defaultValues: {
      name: "",
      size: "",
      location: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: CreateFarmFormType) {
    try {
      await axios.post(`/api/farms`, values);
      form.reset();
      router.refresh();
      toast.success("Farm created succesfully!");

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
        open={isOpen && modalType === "create-initial-farm"}
        onOpenChange={handleClose}
      >
        <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
          <DialogHeader className="py-3 px-3">
            <DialogTitle className="font-bold text-2xl mb-2">
              Create a Farm
            </DialogTitle>
            <DialogDescription className="flex flex-col w-full items-star gap-2"></DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-5">
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <FileUploader
                        endpoint="brandLogoImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Represent your Brand with a logo.
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
                        placeholder="Rego"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The name of your farm.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="4"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Approximate size of your farm (in acres).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Montana"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The location of your farm.
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
                Create Farm
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
