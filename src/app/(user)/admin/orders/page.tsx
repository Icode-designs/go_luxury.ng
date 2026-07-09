import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import OrdersTable from "@/components/user/orders/ordersTable";
import { getOrdersForAdmin } from "@/lib/orders/getOrdersForAdmin";
import React from "react";

const page = async () => {
  const orders = await getOrdersForAdmin();
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Orders</h1>
      </AdminHeaderBox>
      <div className="content">
        <OrdersTable initialOrders={orders} />
      </div>
    </AdminContentBox>
  );
};

export default page;
