"use client";

import { Button } from "@/components/ui/button";

import useModalStore from "@/hooks/use-store-modal";

export default function Onboarding() {
  const { onOpen } = useModalStore();

  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="max-w-xl flex flex-col items-center justify-center gap-3 h-full px-5 mx-auto">
        <h1 className="font-bold md:text-5xl mb-2 text-4xl text-white">
          Bienvenido a <span className="font-extrabold">Rego</span>
        </h1>
        <p className="md:text-[15px] text-sm font-semibold text-gray-300/85 max-w-xl ">
          Effortlessly manage your store's inventory, sales, and orders with our
          all-in-one business management app. Track products, handle billing,
          and streamline operations with QR-based payments and real-time data
          insights.
        </p>
        <Button
          variant={"outline"}
          className="mt-3 w-[150px] hover:scale-105 transition-transform duration-200 ease-in-out flex items-center justify-center"
          onClick={() => onOpen("create-initial-brand")} //open the "create-initial-restaurant" modal from the modal provider
        >
          Create a Brand
        </Button>
      </div>
    </>
  );
}
