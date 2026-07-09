"use client";
import type { ShopCategory } from "@/lib/products/getCategories";
import { FilterGroup, PriceInputRow, ClearFiltersButton } from "./shop.styles";

export interface FilterValues {
  categoryId: string | null;
  minPrice: string;
  maxPrice: string;
}

interface FilterPanelProps {
  categories: ShopCategory[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
}

const FilterPanel = ({
  categories,
  values,
  onChange,
  onClear,
}: FilterPanelProps) => {
  return (
    <div>
      <FilterGroup>
        <h4>Category</h4>
        <label>
          <input
            type="checkbox"
            checked={values.categoryId === null}
            onChange={() => onChange({ ...values, categoryId: null })}
          />
          All
        </label>
        {categories.map((category) => (
          <label key={category.id}>
            <input
              type="checkbox"
              checked={values.categoryId === category.id}
              onChange={() =>
                onChange({
                  ...values,
                  categoryId:
                    values.categoryId === category.id ? null : category.id,
                })
              }
            />
            {category.name}
          </label>
        ))}
      </FilterGroup>

      <FilterGroup>
        <h4>Price (₦)</h4>
        <PriceInputRow>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label="Minimum price"
            value={values.minPrice}
            onChange={(e) => onChange({ ...values, minPrice: e.target.value })}
          />
          <span>–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            aria-label="Maximum price"
            value={values.maxPrice}
            onChange={(e) => onChange({ ...values, maxPrice: e.target.value })}
          />
        </PriceInputRow>
      </FilterGroup>

      <ClearFiltersButton type="button" onClick={onClear}>
        Clear filters
      </ClearFiltersButton>
    </div>
  );
};

export default FilterPanel;
