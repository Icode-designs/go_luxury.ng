// src/lib/products/submitProduct.ts
//
// Each product represents itself directly -- there is no variant system.
// Price, SKU, and stock all live on the product row. Attributes are simple
// descriptive facts about this one product (label + value), not a menu of
// options used to generate purchasable combinations.
import { createClient } from "@/lib/supabase/client";
import type { AttributeValueRow } from "@/components/user/products/productAttributes";

interface SubmitProductArgs {
  productId?: string;
  name: string;
  categoryId: string;
  fullDescription: string;
  basePrice: number;
  discountedPrice: number | null;
  sku: string | null;
  stockCount: number;
  status: "draft" | "active";
  attributes: AttributeValueRow[];
  mediaFiles: { slotIndex: number; file: File }[];
  /** Storage IDs of previously-uploaded images the admin removed or
   *  replaced during this edit session -- these need to be deleted from
   *  Supabase Storage and their product_images rows removed. */
  removedImageStorageIds?: string[];
}

export async function submitProduct(args: SubmitProductArgs) {
  const supabase = createClient();

  // ── 1. Create or reuse the product row ─────────────────────────────
  let productId = args.productId;

  if (!productId) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: args.name,
        category_id: args.categoryId,
        description: args.fullDescription,
        base_price: args.basePrice,
        discounted_price: args.discountedPrice,
        sku: args.sku,
        stock_count: args.stockCount,
        status: args.status,
      })
      .select("id")
      .single();

    if (productError || !product) {
      throw new Error(productError?.message ?? "Failed to create product");
    }
    productId = product.id;
  } else {
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name: args.name,
        description: args.fullDescription,
        base_price: args.basePrice,
        discounted_price: args.discountedPrice,
        sku: args.sku,
        stock_count: args.stockCount,
        status: args.status,
      })
      .eq("id", productId);

    if (updateError) throw new Error(updateError.message);
  }

  // ── 2. Delete removed images -- Storage file + product_images row ────
  if (args.removedImageStorageIds && args.removedImageStorageIds.length > 0) {
    const { error: removeStorageError } = await supabase.storage
      .from("product-images")
      .remove(args.removedImageStorageIds);

    if (removeStorageError) {
      // Log but don't block the save -- an orphaned Storage file is
      // recoverable later; failing the whole product save over it is worse.
      console.error(
        "[submitProduct] failed to remove storage files:",
        removeStorageError.message,
      );
    }

    const { error: removeRowsError } = await supabase
      .from("product_images")
      .delete()
      .in("storage_id", args.removedImageStorageIds);

    if (removeRowsError) {
      console.error(
        "[submitProduct] failed to delete product_images rows:",
        removeRowsError.message,
      );
    }
  }

  // ── 3. Upload new media, insert product_images rows ──────────────────
  for (const { slotIndex, file } of args.mediaFiles) {
    const ext = file.name.split(".").pop();
    const storagePath = `${productId}/${Date.now()}-${slotIndex}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(storagePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      console.error(
        "[submitProduct] image upload failed:",
        uploadError.message,
      );
      continue;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(storagePath);

    await supabase.from("product_images").insert({
      product_id: productId,
      url: urlData.publicUrl,
      storage_id: storagePath,
      is_primary: slotIndex === 0,
      sort_order: slotIndex,
    });
  }

  // ── 4. Replace attribute values ──────────────────────────────────────
  // Simplest correct approach: delete this product's existing
  // product_attributes rows and re-insert the current set. There is no
  // variant/option table depending on these rows anymore, so this is safe
  // and avoids diffing add/remove/rename by hand.
  const { error: deleteAttrsError } = await supabase
    .from("product_attributes")
    .delete()
    .eq("product_id", productId);

  if (deleteAttrsError) {
    console.error(
      "[submitProduct] failed to clear existing attributes:",
      deleteAttrsError.message,
    );
  }

  const attributeRows = args.attributes
    .filter((attr) => attr.label.trim() && attr.value.trim())
    .map((attr) => ({
      product_id: productId,
      label: attr.label.trim(),
      value: attr.value.trim(),
    }));

  if (attributeRows.length > 0) {
    const { error: insertAttrsError } = await supabase
      .from("product_attributes")
      .insert(attributeRows);

    if (insertAttrsError) {
      console.error(
        "[submitProduct] failed to insert attributes:",
        insertAttrsError.message,
      );
    }
  }

  return { productId };
}
