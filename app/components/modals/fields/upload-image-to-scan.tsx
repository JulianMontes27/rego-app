"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import FileUploader from "@/components/file-uploads/file-uploader";
import toast from "react-hot-toast";

import { fastApiTest } from "@/actions/upload-image";

const formSchema = z.object({
  file_url: z.string().min(0),
});

const UploadImageToScanModal = () => {
  const { isOpen, onClose, modalType } = useModalStore();
  const params = useParams();

  if (!params) {
    return <></>;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file_url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = fastApiTest(values);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error creando tu Mesa.");
    }
  }

  return (
    <Dialog
      open={isOpen && modalType === "upload-image"}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-semibold text-2xl">
            Add an image to scan
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      {/* <Input
                        className="bg-white focus:ring-0 text-black "
                        placeholder="1"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      /> */}
                      <FileUploader
                        onChange={field.onChange}
                        value={field.value}
                        endpoint={"messageFile"}
                      />
                    </FormControl>
                    <FormDescription>
                      To identify your field easily.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className="w-full transform transition-transform duration-300 ease-in-out hover:scale-105 px-4 py-2 text-white rounded bg-blue-900"
                disabled={form.formState.isSubmitting}
              >
                Scan
              </button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImageToScanModal;
