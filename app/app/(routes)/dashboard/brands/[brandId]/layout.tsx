import CreateTableButton from "@/components/dashboard/brands/create-table-btn";
import ComboboxParent from "@/components/dashboard/combobox-parent";
import { StoreCombobox } from "@/components/dashboard/store-combobox";
import getSession from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    brandId: string;
  };
}

export const dynamic = "force-dynamic";

const BrandLayout: React.FC<DashboardLayoutProps> = async ({
  children,
  params,
}) => {
  return (
    <main className="flex flex-col">
      <div className="flex flex-row bg-white w-full py-4 fixed">
        <ComboboxParent params={params} />
        <CreateTableButton />
      </div>
      <div className="py-10">{children}</div>
    </main>
  );
};

export default BrandLayout;
