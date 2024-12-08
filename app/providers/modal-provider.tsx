"use client";

import { useState, useEffect } from "react";

import CreateInitialRestaurant from "@/components/modals/restaurants/create-initial-brand";
import CreateTableModal from "@/components/modals/create-table";
import InitiateBillModal from "@/components/modals/initiate-bill";
import AddOrderModal from "@/components/modals/add-order-modal";
import ShowOrdersModal from "@/components/modals/show-orders-modal";
import DeleteRestaurantModal from "@/components/modals/restaurants/delete-modal";
import UpdateRestaurantModal from "@/components/modals/restaurants/update-restaurant-modal";
import UpdateTableModal from "@/components/modals/tables/update-table-modal";
import DeleteTableModal from "@/components/modals/tables/delete-table-modal";

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
      <CreateInitialRestaurant />
      <CreateTableModal />
      <InitiateBillModal />
      <AddOrderModal />
      <ShowOrdersModal />
      <DeleteRestaurantModal />
      <UpdateRestaurantModal />
      <UpdateTableModal />
      <DeleteTableModal />
    </div>
  );
};

export default ModalProvider;
