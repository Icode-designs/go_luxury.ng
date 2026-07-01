"use client";
import {
  AdminContentBox,
  AdminHeaderBox,
  ProductForm,
} from "@/components/user/user.styles";
import { FlexBox } from "@/styles/components.styled";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { BackButton, InputBox } from "@/styles/auth.styles";
import styled from "styled-components";

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

const StyledSelect = styled.select`
  border: ${({ theme }) => theme.colors.col033} 1px solid;
  width: 100%;
  padding: 14px 16px;
  align-self: flex-end;

  &:focus {
    border-color: ${({ theme }) => theme.colors.col010};
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
      <ProductForm>
        <fieldset>
          <div>
            <h2>GENERAL INFORMATION</h2>
          </div>
          <FlexBox $justify="space-between" $gap={10} $width="100%">
            <InputBox>
              <label htmlFor="productTitle">Product Title</label>
              <input
                type="text"
                id="productTitle"
                name="productTitle"
                placeholder="enter product title"
              />
            </InputBox>

            <StyledSelect>
              <option>option 1</option>
              <option>option 1</option>
              <option>option 1</option>
              <option>option 1</option>
            </StyledSelect>
          </FlexBox>

          <InputBox>
            <label htmlFor="productTitle">Short drscription</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="brief overview for search results..."
            />
          </InputBox>
          <InputBox>
            <label htmlFor="productTitle">Full drscription</label>
            <textarea
              id="description"
              name="description"
              placeholder="enter Full description"
            />
          </InputBox>
        </fieldset>
        <fieldset>
          <div>
            <h2>GENERAL INFORMATION</h2>
          </div>
          <InputBox>
            <label htmlFor="productTitle">Product Title</label>
            <input
              type="text"
              id="productTitle"
              name="productTitle"
              placeholder="enter product title"
            />
          </InputBox>
          <InputBox>
            <label htmlFor="productTitle">Short drscription</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="brief overview for search results..."
            />
          </InputBox>
          <InputBox>
            <label htmlFor="productTitle">Full drscription</label>
            <textarea
              id="description"
              name="description"
              placeholder="enter Full description"
            />
          </InputBox>
        </fieldset>
      </ProductForm>
    </AdminContentBox>
  );
};

export default Page;
