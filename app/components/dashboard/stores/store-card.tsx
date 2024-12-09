import { Store } from "@prisma/client";
import Image from "next/image";
import ActionBtn from "../brands/restaurant-actions-btn";
import Link from "next/link";

interface StoreCardProps {
  brandId: string;
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ brandId, store }) => {
  return (
    <div className="rounded-lg p-4 shadow-sm shadow-indigo-100 w-full  flex flex-col items-center">
      <Link href={`/dashboard/brands/${brandId}/${store.id}`}>
        {/* <Image
          src={table.qrCodeUrl!}
          alt={`QR code for table ${table.tableNumber}`}
          className=""
          width={300}
          height={300}
        /> */}
      </Link>

      <div className="mt-2 w-full">
        <div className="flex items-center justify-center w-full flex-col">
          <h1 className="font-bold">
            <span>{store.name}</span>
          </h1>
        </div>
        <div className="mt-6  flex flex-row items-center gap-6 text-xs justify-center">
          <ActionBtn action={"delete"} type={"store"} store={store} />
          <ActionBtn action={"update"} type={"store"} store={store} />
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
