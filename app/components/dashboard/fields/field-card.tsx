import { Field } from "@prisma/client";
import ActionBtn from "../farms/restaurant-actions-btn";
import Link from "next/link";

interface FieldCardProps {
  farmId: string;
  field: Field;
}

const FieldCard: React.FC<FieldCardProps> = ({ farmId, field }) => {
  return (
    <div className="rounded-lg p-4 shadow-sm shadow-indigo-100 w-full  flex flex-col items-center">
      <Link href={`/dashboard/farms/${farmId}/fields/${field.id}`}>
        <div className="flex items-center justify-center w-full flex-col">
          <h1 className="font-bold">
            <span>{field.name}</span>
          </h1>
        </div>
      </Link>

      <div className="mt-2 w-full">
        <div className="mt-6  flex flex-row items-center gap-6 text-xs justify-center">
          <ActionBtn action={"delete"} type={"field"} field={field} />
          <ActionBtn action={"update"} type={"field"} field={field} />
        </div>
      </div>
    </div>
  );
};

export default FieldCard;
