import CreateFieldBtn from "@/components/dashboard/farms/create-table-btn";
import FieldCard from "@/components/dashboard/fields/field-card";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface FarmPageProps {
  params: { farmId: string };
}

const BrandPage = async ({ params }: FarmPageProps) => {
  const farm = await prisma.farm.findFirst({
    where: {
      id: params.farmId,
    },
    include: {
      fields: true,
    },
  });
  if (!farm) {
    return redirect("/");
  }

  return (
    <section className="">
      <div>
        <CreateFieldBtn />
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {farm?.fields.map((field) => (
          <FieldCard field={field} farmId={farm.id} key={field.id} />
        ))}
      </section>
    </section>
  );
};

export default BrandPage;
