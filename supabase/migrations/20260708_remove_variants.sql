-- Removes the variant system project-wide. Each product now represents
-- itself directly: its own price, stock, and SKU. Categories still define
-- template attributes (category_attributes, unchanged); products still
-- carry attribute values (product_attributes), but now as a single
-- label/value pair per attribute rather than a menu of options used to
-- generate variant combinations.
--
-- Run this in the Supabase SQL editor. Back up first if this project has
-- real variant/pricing data you need to preserve -- this migration drops
-- product_variants, variant_attribute_options, and attribute_options
-- entirely, and there is no automatic data-migration step here since the
-- mapping from "many variants" to "one product" is a business decision
-- (e.g. do you keep the cheapest variant's price? split into N products?)
-- that only you can make. Recommended path if you have live variant data:
-- export product_variants + variant_attribute_options to CSV first, then
-- decide row-by-row before running the DROP statements below.
--
-- This version also handles cart_items / order_items, which turned out to
-- carry their own variant_id -> product_variants foreign keys (discovered
-- when the first run of this migration failed with 2BP01: cannot drop
-- table product_variants because other objects depend on it). Cart/checkout
-- isn't wired up in the app yet, so these are very likely empty, but the
-- migration backfills product_id from the variant relationship regardless,
-- in case there's existing data.
--
-- The whole file is written to be safely re-runnable if it fails partway
-- through (as it did the first time) -- every step either uses IF NOT
-- EXISTS/IF EXISTS or is wrapped so a repeat run is a no-op instead of an
-- error.

-- 1. Move stock + SKU onto the product itself.
alter table products
  add column if not exists sku text,
  add column if not exists stock_count integer not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_stock_count_non_negative'
  ) then
    alter table products
      add constraint products_stock_count_non_negative check (stock_count >= 0);
  end if;
end $$;

create unique index if not exists products_sku_unique
  on products (sku)
  where sku is not null;

-- 2. product_attributes now holds one concrete value per attribute per
--    product (e.g. "Color" -> "Black"), not a set of purchasable options.
alter table product_attributes
  add column if not exists value text;

-- 3. cart_items: replace variant_id with product_id.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'cart_items' and column_name = 'variant_id'
  ) then
    alter table cart_items add column if not exists product_id uuid references products(id);

    update cart_items ci
    set product_id = pv.product_id
    from product_variants pv
    where ci.variant_id = pv.id
      and ci.product_id is null;

    alter table cart_items drop constraint if exists cart_items_variant_id_fkey;
    alter table cart_items drop column if exists variant_id;
  end if;
end $$;

-- 4. order_items: same treatment. Order history is more sensitive than an
--    active cart -- if this backfill matters for real historical orders,
--    verify product_id landed correctly before relying on it for reporting.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'order_items' and column_name = 'variant_id'
  ) then
    alter table order_items add column if not exists product_id uuid references products(id);

    update order_items oi
    set product_id = pv.product_id
    from product_variants pv
    where oi.variant_id = pv.id
      and oi.product_id is null;

    alter table order_items drop constraint if exists order_items_variant_id_fkey;
    alter table order_items drop column if exists variant_id;
  end if;
end $$;

-- 5. Drop the variant infrastructure entirely -- safe now that cart_items
--    and order_items no longer reference product_variants.
drop table if exists variant_attribute_options;
drop table if exists product_variants;
drop table if exists attribute_options;
