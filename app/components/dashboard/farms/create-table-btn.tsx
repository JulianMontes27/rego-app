"use client";

import useModalStore from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";

const CreateFieldBtn = () => {
  const { onOpen } = useModalStore();

  return (
    <Button variant={"outline"} onClick={() => onOpen("create-field")}>
      Add field
    </Button>
  );
};

export default CreateFieldBtn;
