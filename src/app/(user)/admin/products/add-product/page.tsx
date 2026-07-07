"use client";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { FlexBox } from "@/styles/components.styled";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import AddProductForm from "@/components/user/products/addProductForm";
import Button from "@/components/ui/button";

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
          <h1>Add Product</h1>
        </FlexBox>
      </AdminHeaderBox>
      <div className="content">
        <AddProductForm />
      </div>
    </AdminContentBox>
  );
};

export default Page;
