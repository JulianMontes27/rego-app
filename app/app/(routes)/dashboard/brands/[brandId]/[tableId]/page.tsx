"use client";

import { useEffect, useState, useCallback } from "react";
import TableCard from "@/components/dashboard/tables/store-card";
import { useSocketContext } from "@/providers/socket-provider";
import { Restaurant, Table, Bill, Order } from "@prisma/client";
import { AlertDestructive } from "@/components/dashboard/alert";
import CreateBillBtn from "@/components/dashboard/bills/create-bill-btn";
import AddOrderBtn from "@/components/dashboard/tables/add-order-btn";
import ActiveBillOrdersTable from "@/components/dashboard/tables/active-bill-orders/active-bill-orders-table";
import BillTooltip from "@/components/dashboard/tables/bill-tooltip";
import BillShowcase from "@/components/dashboard/tables/bill-showcase";

export type RestaurantWithTables = Restaurant & {
  tables: (Table & {
    bills: (Bill & {
      orders: Order[];
    })[];
  })[];
};

interface TablePageProps {
  params: {
    tableId: string;
    restaurantId: string;
  };
}

const TablePage: React.FC<TablePageProps> = ({ params }) => {
  const [restaurant, setRestaurant] = useState<RestaurantWithTables | null>(
    null
  );
  const { socket } = useSocketContext();

  const fetchRestaurantData = useCallback(async () => {
    const response = await fetch(
      `/api/restaurants/${params.restaurantId}/tables/${params.tableId}`
    );
    const data = await response.json();
    setRestaurant(data);
  }, [params.restaurantId, params.tableId]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  useEffect(() => {
    if (socket && socket.connected && params.tableId) {
      const paymentKey = `table:${params.tableId}:pagos`;
      const newBillKey = `table:${params.tableId}:new-bill`;

      const handlePaymentUpdate = () => {
        console.log("NEW PAYMENT RECEIVED");
        fetchRestaurantData();
      };

      const handleNewBill = () => {
        console.log("NEW BILL");
        fetchRestaurantData();
      };

      console.log("Registering listeners:", paymentKey, newBillKey);

      // Register listeners
      socket.on(paymentKey, handlePaymentUpdate);
      socket.on(newBillKey, handleNewBill);

      // Cleanup function
      return () => {
        console.log("Removing listeners:", paymentKey, newBillKey);
        socket.off(paymentKey, handlePaymentUpdate);
        socket.off(newBillKey, handleNewBill);
      };
    } else {
      console.warn("Socket is not connected or tableId is missing");
    }
  }, [socket, params.tableId, fetchRestaurantData]);

  const activeBill = restaurant?.tables[0]?.bills.find((bill) => !bill.isPaid);

  if (!restaurant || restaurant.tables.length === 0) {
    return <div>Table not found for the given restaurant.</div>;
  }

  const paidBills = restaurant.tables[0].bills
    .filter((bill) => bill.isPaid)
    .map((bill) => ({
      id: bill.id,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
      tableId: bill.tableId,
      totalAmount: bill.totalAmount,
      isPaid: bill.isPaid,
      server: bill.server,
      paidAmount: bill.paidAmount,
      orders: bill.orders,
    }));

  return (
    <div className="px-4 flex flex-col gap-8">
      <TableCard
        table={restaurant.tables[0]}
        restaurantId={params.restaurantId}
      />
      {!activeBill && <AlertDestructive msg={"No hay Servicio Activo."} />}

      <CreateBillBtn table={restaurant.tables[0]} activeBill={activeBill} />
      {activeBill && (
        <div className="font-bold flex flex-row gap-2">
          <div className="font-normal flex">
            Empleado a cargo:
            {activeBill?.server ? (
              <>
                <div>{activeBill?.server}</div>
                <BillTooltip isPaid={false} />
              </>
            ) : (
              "n/a"
            )}
          </div>
        </div>
      )}
      {activeBill?.orders && (
        <div>
          <AddOrderBtn activeBill={activeBill} table={restaurant.tables[0]} />
          <ActiveBillOrdersTable orders={activeBill?.orders} />
        </div>
      )}

      <BillShowcase bills={paidBills} />
    </div>
  );
};

export default TablePage;
