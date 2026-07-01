import ProductControl from "@/components/user/productControl";
import {
  AdminContentBox,
  AdminHeaderBox,
  AdminHeaderInputBox,
} from "@/components/user/user.styles";
import React from "react";
import { IoIosSearch } from "react-icons/io";

const page = () => {
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Products</h1>
        <AdminHeaderInputBox>
          <div>
            <input type="text" placeholder="search products..." />
            <IoIosSearch />
          </div>
        </AdminHeaderInputBox>
      </AdminHeaderBox>
      <ProductControl />
    </AdminContentBox>
  );
};

export default page;
