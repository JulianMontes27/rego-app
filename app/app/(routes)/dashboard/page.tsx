import { headers } from "next/headers";
import getSession from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const DashboardHomePage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin");
  }

  try {
    return (
      <div className="flex flex-col gap-3">
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Your content here */}
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    return <div>Error loading data</div>;
  }
};

export default DashboardHomePage;
