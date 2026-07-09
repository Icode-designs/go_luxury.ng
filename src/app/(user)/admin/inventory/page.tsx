import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import InventoryTable from "@/components/user/inventory/inventoryTable";
import { getInventoryForAdmin } from "@/lib/inventory/getInventoryForAdmin";
import React from "react";

const page = async () => {
  const products = await getInventoryForAdmin();
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Inventory</h1>
      </AdminHeaderBox>
      <div className="content">
        <InventoryTable initialProducts={products} />
      </div>
    </AdminContentBox>
  );
};

export default page;
