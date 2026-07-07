// src/app/(user)/admin/products/[productId]/edit/page.tsx
"use client";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { FlexBox } from "@/styles/components.styled";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import EditProductForm from "@/components/user/products/editProductForm";
import { useProduct } from "@/hook/fetchProduct";

const StyledBackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.col000};
  padding: 8px;
  margin: -8px;
  gap: 8px;
  h3 {
    font-size: 12px;
  }
  svg {
    font-size: 20px;
  }
`;

const Page = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, isLoading, error, archiveProduct, reactivateProduct } =
    useProduct(productId);
  const router = useRouter();

  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <FlexBox $gap={20}>
          <StyledBackButton
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <FaArrowLeftLong />
          </StyledBackButton>
          <h1>Edit Product</h1>
        </FlexBox>
      </AdminHeaderBox>
      <div className="content">
        {isLoading && <p>Loading product…</p>}
        {error && <p style={{ color: "#8B3A2A" }}>{error}</p>}
        {product && (
          <EditProductForm
            product={product}
            onArchive={archiveProduct}
            onReactivate={reactivateProduct}
          />
        )}
      </div>
    </AdminContentBox>
  );
};

export default Page;
