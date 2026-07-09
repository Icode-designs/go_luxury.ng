import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import CustomersTable from "@/components/user/customers/customersTable";
import { getCustomersForAdmin } from "@/lib/customers/getCustomersForAdmin";
import React from "react";

const page = async () => {
  const customers = await getCustomersForAdmin();
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Customers</h1>
      </AdminHeaderBox>
      <div className="content">
        <CustomersTable initialCustomers={customers} />
      </div>
    </AdminContentBox>
  );
};

export default page;
