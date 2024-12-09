import StoreCard from "@/components/dashboard/stores/store-card";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface BrandPageProps {
  params: { brandId: string };
}

const BrandPage = async ({ params }: BrandPageProps) => {
  const brands = await prisma.brand.findFirst({
    where: {
      id: params.brandId,
    },
    include: {
      stores: true,
    },
  });
  if (!brands) {
    return redirect("/");
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {brands?.stores.map((store) => (
        <StoreCard store={store} brandId={store.id} key={store.id} />
      ))}
    </section>
  );
};

export default BrandPage;
