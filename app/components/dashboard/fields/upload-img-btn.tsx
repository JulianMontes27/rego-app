"use client";

import { Button } from "@/components/ui/button";
import useModalStore from "@/hooks/use-store-modal";

const UploadImageField = () => {
  const { onOpen } = useModalStore();
  return (
    <Button onClick={() => onOpen("upload-image")}>UploadImageField</Button>
  );
};

export default UploadImageField;
