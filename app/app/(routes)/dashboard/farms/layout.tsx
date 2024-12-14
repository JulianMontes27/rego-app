import { FarmCombobox } from "@/components/dashboard/farm-combobox";
import getSession from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface FarmsPageLayoutProps {
  children: React.ReactNode;
}

const FarmsPageLayout: React.FC<FarmsPageLayoutProps> = async ({
  children,
}) => {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/dashboard/farms");
  }
  const farms = await prisma.farm.findMany({
    where: {
      userId: user?.id,
    },
  });
  return (
    <div>
      <FarmCombobox farms={farms} />
      {children}
    </div>
  );
};

export default FarmsPageLayout;
