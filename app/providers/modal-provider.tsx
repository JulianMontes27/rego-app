"use client";

import { useState, useEffect } from "react";

import CreateInitialFarmModal from "@/components/modals/farms/create-initial-farm";
import CreateFieldModal from "@/components/modals/fields/create-field-modal";
import InitiateBillModal from "@/components/modals/initiate-bill";
import AddOrderModal from "@/components/modals/add-order-modal";
import ShowOrdersModal from "@/components/modals/show-orders-modal";
import DeleteRestaurantModal from "@/components/modals/farms/delete-modal";
import UpdateRestaurantModal from "@/components/modals/farms/update-restaurant-modal";
import UpdateTableModal from "@/components/modals/tables/update-table-modal";
import DeleteTableModal from "@/components/modals/tables/delete-table-modal";
import UploadImageToScanModal from "@/components/modals/fields/upload-image-to-scan";

const ModalProvider = () => {
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    setisMounted(true);
  }, []);
  if (!isMounted) {
    //we are still on the server
    return null;
  }
  return (
    <div className="">
      <CreateInitialFarmModal />
      <CreateFieldModal />
      <InitiateBillModal />
      <UploadImageToScanModal />
      <AddOrderModal />
    </div>
  );
};

export default ModalProvider;
