import getSession from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { StoreCombobox } from "./store-combobox";

interface ComboboxParentProps {
  params: {
    brandId: string;
  };
}

const ComboboxParent: React.FC<ComboboxParentProps> = async ({ params }) => {
  const session = await getSession();
  const user = session?.user;
  if (!user || params.brandId === "") return <>Create a brand first</>;

  const stores = await prisma.store.findMany({
    where: {
      brandId: params.brandId,
    },
  });

  console.log(stores);

  return <StoreCombobox stores={stores} />;
};

export default ComboboxParent;
