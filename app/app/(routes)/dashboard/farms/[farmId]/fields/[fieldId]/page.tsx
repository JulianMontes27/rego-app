import UploadImageField from "@/components/dashboard/fields/upload-img-btn";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface FieldPageProps {
  params: {
    fieldId: string;
    farmId: string;
  };
}

const FieldPage: React.FC<FieldPageProps> = async ({ params }) => {
  const field = await prisma.field.findUnique({
    where: {
      id: params.fieldId,
    },
  });
  if (!field) return redirect("/");

  return (
    <div>
      <h1>{field.name}</h1>
      <UploadImageField />
    </div>
  );
};

export default FieldPage;
