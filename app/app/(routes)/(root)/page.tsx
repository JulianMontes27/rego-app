import LandingPage from "@/components/root-page/public-landing-page";
import prisma from "@/lib/prisma";

import { redirect } from "next/navigation";
import Onboarding from "@/components/root-page/onboarding";
import { auth } from "@/lib/auth";

export default async function CreateRestaurantModalPage() {
  const session = await auth(); //fetch session on the server
  //get the User object (currently signed in User) from the Session object in the DB
  const user = session?.user;
  if (!user) {
    return <LandingPage />;
  }
  //check if the User has a Restaurant created, if he has at least one, redirect to the /dashboard page of the first Restaurant found, if not, open the modal to create a Restaurant
  const store = await prisma.farm.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (store) {
    return redirect(`/dashboard`);
  }
  return (
    <>
      <Onboarding />
    </>
  );
}
