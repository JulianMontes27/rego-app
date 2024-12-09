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
    const fastApiTest = await fetch("http://localhost:8000/secure-data", {
      credentials: "include",
      headers: {
        Cookie: headers().get("cookie") || "",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!fastApiTest.ok) {
      throw new Error(`HTTP error! status: ${fastApiTest.status}`);
    }

    const data = await fastApiTest.json();

    const res = await prisma.brand.findMany({
      where: {
        ownerId: user.id,
      },
      include: {
        stores: true,
      },
    });

    if (!res) {
      redirect("/");
    }

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
