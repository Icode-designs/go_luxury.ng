// src/components/admin/products/ProductsEmptyState.tsx
import Link from "next/link";
import { EmptyStateWrap } from "./products.styles";

interface ProductsEmptyStateProps {
  hasProducts: boolean; // true = filters returned nothing, false = truly no products yet
}

const ProductsEmptyState = ({ hasProducts }: ProductsEmptyStateProps) => {
  return (
    <EmptyStateWrap>
      {hasProducts ? (
        <p>No products match your search.</p>
      ) : (
        <>
          <p>No products yet.</p>
          <Link href="/admin/products/add-product">Add your first product</Link>
        </>
      )}
    </EmptyStateWrap>
  );
};

export default ProductsEmptyState;
