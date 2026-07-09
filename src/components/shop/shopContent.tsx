"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { IoFilterOutline, IoClose, IoSearchOutline } from "react-icons/io5";
import type { ShopCategory } from "@/lib/products/getCategories";
import { useProducts, type ProductSortMode } from "@/hook/fetchProducts";
import { ProductCardItem } from "@/components/homepage/productCardItem";
import { ProductsGrid } from "@/components/homepage/home.styles";
import {
  ShopContainer,
  ShopHeaderRow,
  ShopToolbarRow,
  SearchBox,
  FilterToggleButton,
  ShopLayout,
  FilterSidebar,
  FilterOverlay,
  FilterDrawerPanel,
  FilterDrawerHeader,
  NoResultsBox,
  SkeletonGrid,
  SkeletonCard,
} from "./shop.styles";
import FilterPanel, { type FilterValues } from "./filterPanel";

interface ShopContentProps {
  categories: ShopCategory[];
}

const SORT_OPTIONS: { value: ProductSortMode; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
];

// Number(...) on a malformed string (e.g. leftover partial input) yields
// NaN, which still satisfies `typeof x === "number"` -- guard it out here
// so a stray non-numeric value can never reach the Supabase query.
function toValidNumber(value: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const ShopContent = ({ categories }: ShopContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // "Applied" filters drive the actual query. Seeded from the URL so the
  // page is shareable/bookmarkable and survives a refresh.
  const [filters, setFilters] = useState<FilterValues>(() => ({
    categoryId: searchParams.get("category"),
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  }));
  const [sort, setSort] = useState<ProductSortMode>(
    (searchParams.get("sort") as ProductSortMode) || "newest",
  );
  // Seeded from ?q= — this is how the header search button reaches the shop
  // page. Kept separate from `filters` (category/price) since it also gets
  // its own toolbar input here for refining/re-searching in place.
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  // If the URL's ?q= changes from outside this component (e.g. the header
  // search dropdown pushes a new query while already on /shop, which does
  // not remount this component), pick it up so results actually update.
  useEffect(() => {
    const urlSearch = searchParams.get("q") ?? "";
    setSearch((current) => (current === urlSearch ? current : urlSearch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Keep the URL in sync so filters are shareable and survive a refresh --
  // debounced for price/search so we don't push a history entry per keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.categoryId) params.set("category", filters.categoryId);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (sort !== "newest") params.set("sort", sort);
      if (search) params.set("q", search);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, search, pathname]);

  const queryFilters = useMemo(
    () => ({
      categoryId: filters.categoryId ?? undefined,
      minPrice: toValidNumber(filters.minPrice),
      maxPrice: toValidNumber(filters.maxPrice),
      sort,
      search: search || undefined,
    }),
    [filters, sort, search],
  );

  const { products, isLoading, error, retry } = useProducts(queryFilters);

  const handleClear = useCallback(() => {
    setFilters({ categoryId: null, minPrice: "", maxPrice: "" });
    setSort("newest");
    setSearch("");
  }, []);

  const hasActiveFilters =
    filters.categoryId !== null ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    search !== "";

  return (
    <ShopContainer>
      <ShopHeaderRow>
        <div>
          <h1>{search ? `Results for "${search}"` : "Shop All Products"}</h1>
          <p>
            {isLoading
              ? "Loading..."
              : `${products.length} product${products.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </ShopHeaderRow>

      <ShopToolbarRow>
        <FilterToggleButton type="button" onClick={() => setIsDrawerOpen(true)}>
          <IoFilterOutline aria-hidden="true" />
          {hasActiveFilters ? "Filters •" : "Filters"}
        </FilterToggleButton>

        <SearchBox>
          <IoSearchOutline aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
          />
        </SearchBox>

        <select
          aria-label="Sort products"
          value={sort}
          onChange={(e) => setSort(e.target.value as ProductSortMode)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </ShopToolbarRow>

      <ShopLayout>
        <FilterSidebar aria-label="Filters">
          <FilterPanel
            categories={categories}
            values={filters}
            onChange={setFilters}
            onClear={handleClear}
          />
        </FilterSidebar>

        {isDrawerOpen && (
          <FilterOverlay onClick={() => setIsDrawerOpen(false)} aria-hidden="true" />
        )}
        <FilterDrawerPanel $open={isDrawerOpen} aria-hidden={!isDrawerOpen}>
          <FilterDrawerHeader>
            <h3>Filters</h3>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setIsDrawerOpen(false)}
            >
              <IoClose />
            </button>
          </FilterDrawerHeader>
          <FilterPanel
            categories={categories}
            values={filters}
            onChange={setFilters}
            onClear={handleClear}
          />
        </FilterDrawerPanel>

        <div>
          {isLoading && (
            <SkeletonGrid aria-busy="true" aria-label="Loading products">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i}>
                  <div className="skeleton-image" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line" />
                </SkeletonCard>
              ))}
            </SkeletonGrid>
          )}

          {!isLoading && error && (
            <NoResultsBox>
              <h2>Something went wrong</h2>
              <p>{error}</p>
              <ClearFiltersRetryButton onRetry={retry} />
            </NoResultsBox>
          )}

          {!isLoading && !error && products.length === 0 && (
            <NoResultsBox>
              <IoSearchOutline aria-hidden="true" />
              <h2>No products found</h2>
              <p>Try adjusting or clearing your filters to see more results.</p>
              <ClearFiltersRetryButton onRetry={handleClear} label="Clear filters" />
            </NoResultsBox>
          )}

          {!isLoading && !error && products.length > 0 && (
            <ProductsGrid>
              {products.map((product) => (
                <ProductCardItem
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    base_price: product.basePrice,
                    discounted_price: product.discountedPrice,
                    primaryImageUrl: product.primaryImageUrl,
                    isNew: false,
                    averageRating: null,
                    reviewCount: 0,
                  }}
                />
              ))}
            </ProductsGrid>
          )}
        </div>
      </ShopLayout>
    </ShopContainer>
  );
};

// Small inline helper to avoid pulling in the button styles for one action.
function ClearFiltersRetryButton({
  onRetry,
  label = "Try again",
}: {
  onRetry: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onRetry}
      style={{
        textTransform: "uppercase",
        fontSize: 12,
        letterSpacing: "0.04em",
        textDecoration: "underline",
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export default ShopContent;
