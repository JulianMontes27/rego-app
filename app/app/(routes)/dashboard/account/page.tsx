import React from "react";

import getSession from "@/lib/get-session";

import { redirect } from "next/navigation";
import { User } from "@prisma/client";

//manage User account
const AccountPage = async () => {
  //chequear Auth
  const session = await getSession();
  if (!session) {
    return null;
  }
  // Fetch full user data from the database if needed
  const user = session.user as Partial<User>; // Cast it as Partial<User> if fields may be missing
  if (!user) {
    return redirect("/api/auth/signin");
  }
  return <section></section>;
};

export default AccountPage;
