import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import ReturnsTable from "@/components/user/returns/returnsTable";
import { getReturnsForAdmin } from "@/lib/returns/getReturnsForAdmin";
import React from "react";

const page = async () => {
  const returns = await getReturnsForAdmin();
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Returns</h1>
      </AdminHeaderBox>
      <div className="content">
        <ReturnsTable initialReturns={returns} />
      </div>
    </AdminContentBox>
  );
};

export default page;
