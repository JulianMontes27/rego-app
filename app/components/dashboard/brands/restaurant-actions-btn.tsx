"use client";

import useModalStore from "@/hooks/use-store-modal";
import { Brand, Store } from "@prisma/client";
import { Settings, Trash2 } from "lucide-react";

interface ActionBtnProps {
  action: "delete" | "update";
  type: "brand" | "store";
  brand?: Brand;
  store?: Store;
}

const actionTypeMap = {
  delete: <Trash2 className="h-4 w-4 ml-2 text-red-500" />,
  update: <Settings className="h-4 w-4 ml-2 text-gray-500" />,
};

const ActionBtn: React.FC<ActionBtnProps> = ({
  action,
  type,
  brand,
  store,
}) => {
  //get Global (zustand) modal state
  const { onOpen } = useModalStore();

  const modalAction =
    type === "brand" && action === "delete"
      ? "delete-brand"
      : type === "brand" && action === "update"
      ? "update-brand"
      : type === "store" && action === "delete"
      ? "delete-store"
      : "update-store";

  return (
    <button
      className="hover:scale-110 transition-all"
      onClick={() => onOpen(modalAction, { brand, store })}
    >
      {actionTypeMap[action]}
    </button>
  );
};

export default ActionBtn;
