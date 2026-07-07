// src/lib/products/submitProduct.ts
import { createClient } from "@/lib/supabase/client";
import type { AttributeRow } from "@/components/user/products/productVariants";

interface SubmitProductArgs {
  productId?: string;
  name: string;
  categoryId: string;
  fullDescription: string;
  basePrice: number;
  discountedPrice: number | null;
  status: "draft" | "active";
  attributes: AttributeRow[];
  variantRows: Record<
    string,
    { stock: string; priceOverride: string; sku: string }
  >;
  mediaFiles: { slotIndex: number; file: File }[];
  /** Storage IDs of previously-uploaded images the admin removed or
   *  replaced during this edit session — these need to be deleted from
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
        status: args.status,
      })
      .eq("id", productId);

    if (updateError) throw new Error(updateError.message);
  }

  // ── 2. Delete removed images — Storage file + product_images row ────
  if (args.removedImageStorageIds && args.removedImageStorageIds.length > 0) {
    const { error: removeStorageError } = await supabase.storage
      .from("product-images")
      .remove(args.removedImageStorageIds);

    if (removeStorageError) {
      // Log but don't block the save — an orphaned Storage file is
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

  // ── 4. Write attributes + options ────────────────────────────────────
  // (unchanged from before — see known gap noted at the end)
  const attributeIdByLabel = new Map<string, string>();

  for (const attr of args.attributes) {
    if (!attr.label.trim() || attr.options.length === 0) continue;

    const { data: attrRow, error: attrError } = await supabase
      .from("product_attributes")
      .insert({ product_id: productId, label: attr.label })
      .select("id")
      .single();

    if (attrError || !attrRow) {
      console.error(
        "[submitProduct] attribute insert failed:",
        attrError?.message,
      );
      continue;
    }

    attributeIdByLabel.set(attr.label, attrRow.id);

    const optionRows = attr.options
      .filter((opt) => opt.trim())
      .map((opt) => ({ attribute_id: attrRow.id, value: opt }));

    if (optionRows.length > 0) {
      await supabase.from("attribute_options").insert(optionRows);
    }
  }

  // ── 5. Write variants + their option links ───────────────────────────
  const { data: allOptions } = await supabase
    .from("attribute_options")
    .select(
      "id, value, attribute_id, product_attributes!inner(product_id, label)",
    )
    .eq("product_attributes.product_id", productId);

  const optionIdFor = (label: string, value: string) =>
    allOptions?.find(
      (o: any) => o.product_attributes.label === label && o.value === value,
    )?.id;

  const activeAttrLabels = args.attributes
    .filter((a) => a.label.trim() && a.options.length > 0)
    .map((a) => a.label);

  for (const [key, row] of Object.entries(args.variantRows)) {
    if (!row.stock && !row.sku) continue;

    const comboValues = key.split(" / ");

    const { data: variant, error: variantError } = await supabase
      .from("product_variants")
      .insert({
        product_id: productId,
        sku: row.sku,
        price_override: row.priceOverride ? Number(row.priceOverride) : null,
        stock_count: Number(row.stock) || 0,
      })
      .select("id")
      .single();

    if (variantError || !variant) {
      console.error(
        "[submitProduct] variant insert failed:",
        variantError?.message,
      );
      continue;
    }

    const optionIds = comboValues
      .map((val, i) => optionIdFor(activeAttrLabels[i], val))
      .filter((id): id is string => Boolean(id));

    if (optionIds.length > 0) {
      await supabase.from("variant_attribute_options").insert(
        optionIds.map((optionId) => ({
          variant_id: variant.id,
          attribute_option_id: optionId,
        })),
      );
    }
  }

  return { productId };
}
