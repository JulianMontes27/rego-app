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

const CreateBrandFormSchema = z.object({
  name: z.string().min(2, {
    message: "Server name must be at least 2 characters.",
  }),
  logoUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});

type CreateBrandFormType = z.infer<typeof CreateBrandFormSchema>;

export default function CreateServerModal() {
  const { isOpen, onClose, modalType } = useModalStore();
  const handleClose = () => {
    onClose();
  };
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<CreateBrandFormType>({
    resolver: zodResolver(CreateBrandFormSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: CreateBrandFormType) {
    try {
      await axios.post(`/api/brands`, values);
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
        open={isOpen && modalType === "create-initial-brand"}
        onOpenChange={handleClose}
      >
        <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
          <DialogHeader className="py-3 px-3">
            <DialogTitle className="font-bold text-2xl mb-2">
              Create a Brand
            </DialogTitle>
            <DialogDescription className="flex flex-col w-full items-star gap-2"></DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
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
                        placeholder="Rego"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Name your Brand.</FormDescription>
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
                Create Brand
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
