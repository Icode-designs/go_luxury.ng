// src/hook/useCategoryManagement.ts
"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface CategoryAttributeTemplate {
  id: string;
  label: string;
  required: boolean;
  sort_order: number;
}

export interface ManagedCategory {
  id: string;
  name: string;
  status: "active" | "archived";
  image_url: string | null;
  image_storage_id: string | null;
  attributes: CategoryAttributeTemplate[];
}

export function useCategoryManagement() {
  const [categories, setCategories] = useState<ManagedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("categories")
      .select(
        `
        id, name, status, image_url, image_storage_id,
        category_attributes ( id, label, required, sort_order )
        `,
      )
      .order("name");

    if (fetchError) {
      console.error("[useCategoryManagement] fetch error:", fetchError.message);
      setError("Failed to load categories.");
      setIsLoading(false);
      return;
    }

    setCategories(
      (data ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        image_url: c.image_url,
        image_storage_id: c.image_storage_id,
        attributes: (c.category_attributes ?? []).sort(
          (a: CategoryAttributeTemplate, b: CategoryAttributeTemplate) =>
            a.sort_order - b.sort_order,
        ),
      })),
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(
    async (name: string) => {
      const supabase = createClient();
      const { error: createError } = await supabase
        .from("categories")
        .insert({ name, status: "active" });

      if (createError) throw new Error(createError.message);
      await fetchCategories();
    },
    [fetchCategories],
  );

  const renameCategory = useCallback(
    async (categoryId: string, name: string) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("categories")
        .update({ name })
        .eq("id", categoryId);

      if (updateError) throw new Error(updateError.message);
      await fetchCategories();
    },
    [fetchCategories],
  );

  const setCategoryStatus = useCallback(
    async (categoryId: string, status: "active" | "archived") => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("categories")
        .update({ status })
        .eq("id", categoryId);

      if (updateError) throw new Error(updateError.message);
      await fetchCategories();
    },
    [fetchCategories],
  );

  const setCategoryImage = useCallback(
    async (
      categoryId: string,
      file: File,
      previousStorageId: string | null,
    ) => {
      const supabase = createClient();

      // Remove the old image first, if one exists, to avoid orphaned files
      if (previousStorageId) {
        await supabase.storage
          .from("category-images")
          .remove([previousStorageId]);
      }

      const ext = file.name.split(".").pop();
      const storagePath = `${categoryId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from("category-images")
        .getPublicUrl(storagePath);

      const { error: updateError } = await supabase
        .from("categories")
        .update({
          image_url: urlData.publicUrl,
          image_storage_id: storagePath,
        })
        .eq("id", categoryId);

      if (updateError) throw new Error(updateError.message);
      await fetchCategories();
    },
    [fetchCategories],
  );

  const removeCategoryImage = useCallback(
    async (categoryId: string, storageId: string) => {
      const supabase = createClient();

      await supabase.storage.from("category-images").remove([storageId]);

      const { error: updateError } = await supabase
        .from("categories")
        .update({ image_url: null, image_storage_id: null })
        .eq("id", categoryId);

      if (updateError) throw new Error(updateError.message);
      await fetchCategories();
    },
    [fetchCategories],
  );

  const addAttributeToCategory = useCallback(
    async (categoryId: string, label: string) => {
      const supabase = createClient();
      const category = categories.find((c) => c.id === categoryId);
      const nextSortOrder = category ? category.attributes.length : 0;

      const { error: insertError } = await supabase
        .from("category_attributes")
        .insert({ category_id: categoryId, label, sort_order: nextSortOrder });

      if (insertError) throw new Error(insertError.message);
      await fetchCategories();
    },
    [categories, fetchCategories],
  );

  const removeAttributeFromCategory = useCallback(
    async (attributeId: string) => {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("category_attributes")
        .delete()
        .eq("id", attributeId);

      if (deleteError) throw new Error(deleteError.message);
      await fetchCategories();
    },
    [fetchCategories],
  );

  return {
    categories,
    isLoading,
    error,
    retry: fetchCategories,
    createCategory,
    renameCategory,
    setCategoryStatus,
    setCategoryImage,
    removeCategoryImage,
    addAttributeToCategory,
    removeAttributeFromCategory,
  };
}
