// src/components/settings/CategoriesSettings.tsx
"use client";
import React, { useState } from "react";
import { useCategoryManagement } from "@/hook/useCategoryManagement";
import {
  CategoryListWrap,
  CategoryRow,
  CategoryRowInfo,
  CategoryStatusPill,
  AttributeTagRow,
  AttributeTag,
  AddAttributeInput,
  CategoryRowActions,
  NewCategoryRow,
} from "./settings.styles";
import { RiCloseLine } from "react-icons/ri";
import CategoryImageTile from "./categoryImageTile";

const CategoriesSettings = () => {
  const {
    categories,
    isLoading,
    error,
    createCategory,
    renameCategory,
    setCategoryStatus,
    setCategoryImage,
    removeCategoryImage,
    addAttributeToCategory,
    removeAttributeFromCategory,
  } = useCategoryManagement();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAttributeDraft, setNewAttributeDraft] = useState<
    Record<string, string>
  >({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory(newCategoryName.trim());
      setNewCategoryName("");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to create category.",
      );
    }
  }

  async function handleImageUpload(
    categoryId: string,
    file: File,
    previousStorageId: string | null,
  ) {
    setUploadingId(categoryId);
    setActionError(null);
    try {
      await setCategoryImage(categoryId, file, previousStorageId);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to upload image.",
      );
    } finally {
      setUploadingId(null);
    }
  }

  async function handleAddAttribute(categoryId: string) {
    const label = newAttributeDraft[categoryId]?.trim();
    if (!label) return;
    try {
      await addAttributeToCategory(categoryId, label);
      setNewAttributeDraft((prev) => ({ ...prev, [categoryId]: "" }));
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to add attribute.",
      );
    }
  }

  if (isLoading) return <p>Loading categories…</p>;
  if (error) return <p style={{ color: "#8B3A2A" }}>{error}</p>;

  return (
    <div>
      <h3 style={{ marginBottom: 16, fontSize: 24 }}>Categories</h3>
      <p style={{ fontSize: 13, color: "#9A8880", marginBottom: 20 }}>
        Categories define what attributes products in them will have (e.g. Wigs
        → Length, Density, Lace color). Changing a category&apos;s attribute
        template only affects new products going forward — existing products
        keep their own attribute snapshot and can be manually updated if needed.
      </p>

      <form onSubmit={handleCreateCategory} style={{ marginBottom: 24 }}>
        <NewCategoryRow>
          <input
            type="text"
            placeholder="New category name…"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button type="submit">Add category</button>
        </NewCategoryRow>
      </form>

      {actionError && (
        <p style={{ color: "#8B3A2A", fontSize: 13, marginBottom: 16 }}>
          {actionError}
        </p>
      )}

      <CategoryListWrap>
        {categories.map((cat) => (
          <CategoryRow key={cat.id}>
            <CategoryImageTile
              image={cat.image_url}
              isUploading={uploadingId === cat.id}
              onFile={(file) =>
                handleImageUpload(cat.id, file, cat.image_storage_id)
              }
              onRemove={() => {
                if (cat.image_storage_id)
                  removeCategoryImage(cat.id, cat.image_storage_id);
              }}
            />

            <CategoryRowInfo>
              <input
                type="text"
                defaultValue={cat.name}
                onBlur={(e) => {
                  if (e.target.value.trim() && e.target.value !== cat.name) {
                    renameCategory(cat.id, e.target.value.trim());
                  }
                }}
              />

              <CategoryStatusPill $status={cat.status}>
                {cat.status}
              </CategoryStatusPill>

              <AttributeTagRow>
                {cat.attributes.map((attr) => (
                  <AttributeTag key={attr.id}>
                    {attr.label}
                    <button
                      type="button"
                      onClick={() => removeAttributeFromCategory(attr.id)}
                      aria-label={`Remove ${attr.label} attribute`}
                    >
                      <RiCloseLine />
                    </button>
                  </AttributeTag>
                ))}

                <AddAttributeInput>
                  <input
                    type="text"
                    placeholder="+ attribute"
                    value={newAttributeDraft[cat.id] ?? ""}
                    onChange={(e) =>
                      setNewAttributeDraft((prev) => ({
                        ...prev,
                        [cat.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAttribute(cat.id);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddAttribute(cat.id)}
                  >
                    Add
                  </button>
                </AddAttributeInput>
              </AttributeTagRow>
            </CategoryRowInfo>

            <CategoryRowActions>
              {cat.status === "active" ? (
                <button
                  type="button"
                  onClick={() => setCategoryStatus(cat.id, "archived")}
                >
                  Archive
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCategoryStatus(cat.id, "active")}
                >
                  Reactivate
                </button>
              )}
            </CategoryRowActions>
          </CategoryRow>
        ))}
      </CategoryListWrap>
    </div>
  );
};

export default CategoriesSettings;
