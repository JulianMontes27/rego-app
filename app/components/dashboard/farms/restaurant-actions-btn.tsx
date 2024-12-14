"use client";

import useModalStore from "@/hooks/use-store-modal";
import { Farm, Field } from "@prisma/client";
import { Settings, Trash2 } from "lucide-react";

interface ActionBtnProps {
  action: "delete" | "update";
  type: "farm" | "field";
  farm?: Farm;
  field?: Field;
}

const actionTypeMap = {
  delete: <Trash2 className="h-4 w-4 ml-2 text-red-500" />,
  update: <Settings className="h-4 w-4 ml-2 text-gray-500" />,
};

const ActionBtn: React.FC<ActionBtnProps> = ({ action, type, farm, field }) => {
  //get Global (zustand) modal state
  const { onOpen } = useModalStore();

  const modalAction =
    type === "farm" && action === "delete"
      ? "delete-farm"
      : type === "farm" && action === "update"
      ? "update-farm"
      : type === "field" && action === "delete"
      ? "delete-field"
      : "update-field";

  return (
    <button
      className="hover:scale-110 transition-all"
      onClick={() => onOpen(modalAction, { farm, field })}
    >
      {actionTypeMap[action]}
    </button>
  );
};

export default ActionBtn;
