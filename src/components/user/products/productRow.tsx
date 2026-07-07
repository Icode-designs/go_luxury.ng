"use client";
import { useState } from "react";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { AdminProductRow } from "@/lib/products/getProductsForAdmin";
import {
  ActionsDropdown,
  ActionsMenu,
  ActionsMenuButton,
  RowThumb,
  StatusPill,
} from "./products.styles";
import { FaPencil } from "react-icons/fa6";

interface ProductRowProps {
  product: AdminProductRow;
}

const ProductRow = ({ product }: ProductRowProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isOnSale = product.discounted_price !== null;

  return (
    <tr>
      <td>
        <RowThumb>
          {product.primaryImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.primaryImageUrl} alt={product.name} />
          ) : (
            <div className="placeholder" />
          )}
        </RowThumb>
      </td>

      <td>{product.name}</td>

      <td>{product.category?.name ?? "—"}</td>

      <td>
        {product.variantCount} variant{product.variantCount === 1 ? "" : "s"}
      </td>

      <td>
        {isOnSale ? (
          <>
            <span
              style={{
                textDecoration: "line-through",
                color: "#9A8880",
                marginRight: 6,
              }}
            >
              ₦{product.base_price.toLocaleString()}
            </span>
            <span style={{ color: "#8B3A2A" }}>
              ₦{product.discounted_price!.toLocaleString()}
            </span>
          </>
        ) : (
          <span>₦{product.base_price.toLocaleString()}</span>
        )}
      </td>

      <td>
        <StatusPill $status={product.status}>{product.status}</StatusPill>
      </td>

      <td>
        <Link
          href={`/admin/products/edit-product/${product.id}`}
          title="Edit Product"
        >
          <FaPencil />
        </Link>
      </td>
    </tr>
  );
};

export default ProductRow;
