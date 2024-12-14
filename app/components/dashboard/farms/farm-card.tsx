import { Farm } from "@prisma/client";
import ActionBtn from "./restaurant-actions-btn";
import Link from "next/link";

interface FarmCardProps {
  farm: Farm;
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  return (
    <div className="rounded-lg p-4 shadow-md shadow-indigo-100 w-full flex flex-col items-center">
      <Link href={`/dashboard/farms/${farm.id}`}>{farm.name}</Link>

      <div className="mt-2 w-full">
        <div className="flex items-center justify-center w-full flex-col">
          <h1 className="font-bold">{farm.name}</h1>
        </div>
        <div className="mt-6 flex flex-row items-center gap-8 text-xs justify-center">
          <ActionBtn action={"delete"} type={"farm"} farm={farm} />
          <ActionBtn action={"update"} type={"farm"} farm={farm} />
        </div>
      </div>
    </div>
  );
};

export default FarmCard;
