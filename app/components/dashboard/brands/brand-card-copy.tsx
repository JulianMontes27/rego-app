import { Brand } from "@prisma/client";
import Image from "next/image";
import ActionBtn from "./restaurant-actions-btn";
import Link from "next/link";

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  return (
    <div className="rounded-lg p-4 shadow-md shadow-indigo-100 w-full flex flex-col items-center">
      <Link href={`/dashboard/brands/${brand.id}`}>
        {brand.logo ? (
          <Image
            alt={`Brand image.`}
            src={brand.logo}
            className=""
            width={300}
            height={300}
          />
        ) : (
          <div>Brand logo</div>
        )}
      </Link>

      <div className="mt-2 w-full">
        <div className="flex items-center justify-center w-full flex-col">
          <h1 className="font-bold">{brand.name}</h1>
        </div>
        <div className="mt-6 flex flex-row items-center gap-8 text-xs justify-center">
          <ActionBtn action={"delete"} type={"brand"} brand={brand} />
          <ActionBtn action={"update"} type={"brand"} brand={brand} />
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
