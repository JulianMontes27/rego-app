"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import axios from "axios";
import qs from "query-string";

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
  name: z.string().min(0),
  size: z.string().min(0),
  cropType: z.string().min(0),
  lastPlanted: z.date().optional(),
});

const CreateFieldModal = () => {
  const { isOpen, onClose, modalType } = useModalStore();
  const router = useRouter();
  const params = useParams();

  if (!params) {
    return <></>;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      size: "",
      cropType: "",
      // last_planted: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: "/api/fields",
        query: {
          farmId: params?.farmId,
        },
      });
      await axios.post(url, values).then((res) => {
        router.refresh();
        //res.data
        if (res.data) router.refresh();
      });
      toast.success("Added field.");

      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error creando tu Mesa.");
    }
  }

  return (
    <Dialog
      open={isOpen && modalType === "create-field"}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-semibold text-2xl">
            Add a field
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white focus:ring-0 text-black "
                        placeholder="1"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      To identify your field easily.
                    </FormDescription>
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
                        className="bg-white focus:ring-0 text-black "
                        placeholder="1"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Size of your field (meters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop type</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white focus:ring-0 text-black "
                        placeholder="1"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      The type of crop is in the field.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <button
                type="submit"
                className="w-full transform transition-transform duration-300 ease-in-out hover:scale-105 px-4 py-2 text-white rounded bg-blue-900"
                disabled={form.formState.isSubmitting}
              >
                Add
              </button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFieldModal;
