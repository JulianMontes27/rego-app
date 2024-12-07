import React from "react";

import Navbar from "./navbar";
import Hero from "./hero";

const LandingPage = () => {
  return (
    <section className="flex flex-col h-screen  inset-0 -z-10 w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <Navbar />
      <Hero />
    </section>
  );
};

export default LandingPage;
