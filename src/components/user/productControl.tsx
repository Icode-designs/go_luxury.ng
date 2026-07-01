"use client";
import { FlexBox } from "@/styles/components.styled";
import React from "react";
import Button from "../ui/button";
import { FaPlus } from "react-icons/fa6";
import styled from "styled-components";
import { IoFilter } from "react-icons/io5";
import Link from "next/link";

const StyledSelect = styled.select`
  background-color: ${({ theme }) => theme.colors.col040};
  border-radius: 8px;
  padding: 8px 12px;
  width: 100%;
  font-size: 16px;
  border: none;
`;

const FilterBtn = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.col040};
  justify-content: center;
  gap: 10px;
  svg,
  h3 {
    font-size: 16px;
  }
`;

const StyledLink = styled(Link)`
  padding: 12px 24px;
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  border: none;
  max-width: 200px;
  font-family: ${({ theme }) => theme.fonts.fontPrimary};
  font-size: 16px;
  font-weight: 400;
  transition: all 0.3s ease-in-out;

  background-color: ${({ theme }) => theme.colors.col070};
  color: ${({ theme }) => theme.colors.col040};
  border-radius: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.col000};
    cursor: pointer;
  }
`;

const ProductControl = () => {
  return (
    <FlexBox $justify="space-between" $width="100%">
      <FlexBox $width={320} $justify="space-between" $gap={16}>
        <StyledSelect defaultValue="select a category">
          <option value="hair">Hair</option>
          <option value="wig">Wig</option>
          <option value="accessories">Accessories</option>
        </StyledSelect>

        <FilterBtn>
          <IoFilter />
          <h3>Filter By</h3>
        </FilterBtn>
      </FlexBox>

      <StyledLink href="/admin/products/add-product">
        <FaPlus />
        <>Add products</>
      </StyledLink>
    </FlexBox>
  );
};

export default ProductControl;
