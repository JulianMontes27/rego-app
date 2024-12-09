"use client";
import useModalStore from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";

const CreateStoreButton = () => {
  const { onOpen } = useModalStore();

  return (
    <Button variant={"outline"} onClick={() => onOpen("create-store")}>
      Crear nueva Mesa
    </Button>
  );
};

export default CreateStoreButton;
