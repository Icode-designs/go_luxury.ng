import { StyledLink } from "@/components/user/products/products.styles";
import ProductsTable from "@/components/user/products/productsTable";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { getProductsForAdmin } from "@/lib/products/getProductsForAdmin";
import React from "react";
import { FaPlus } from "react-icons/fa6";

const page = async () => {
  const products = await getProductsForAdmin();
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Products</h1>
        <StyledLink href="/admin/products/add-product">
          <FaPlus />
          <>Add products</>
        </StyledLink>
      </AdminHeaderBox>
      <div className="content">
        <ProductsTable initialProducts={products} />
      </div>
    </AdminContentBox>
  );
};

export default page;
