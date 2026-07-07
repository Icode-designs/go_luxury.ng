// src/hook/useProductMedia.ts
"use client";
import { useState, useEffect, useCallback } from "react";

const SLOT_COUNT = 5;
const STORAGE_KEY = "productMediaImages";

export interface MediaSlot {
  file: File | null;
  preview: string | null;
  fileName: string | null;
  fileType: string | null;
  /** Set when this slot represents an image already uploaded to Storage
   *  (as opposed to a freshly-picked local file awaiting upload). */
  existingStorageId: string | null;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function dataUrlToFile(
  dataUrl: string,
  fileName: string,
  fileType: string,
): File {
  const [, base64] = dataUrl.split(",");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], fileName, { type: fileType });
}

export interface ExistingImage {
  storageId: string;
  url: string;
  isPrimary: boolean;
}

function emptySlots(): MediaSlot[] {
  return Array.from({ length: SLOT_COUNT }, () => ({
    file: null,
    preview: null,
    fileName: null,
    fileType: null,
    existingStorageId: null,
  }));
}

// Builds initial slots from images already saved in Storage — primary
// image always goes in slot 0, remaining images fill slots 1-4 in order.
function slotsFromExisting(existingImages: ExistingImage[]): MediaSlot[] {
  const slots = emptySlots();
  const primary = existingImages.find((img) => img.isPrimary);
  const secondary = existingImages.filter((img) => !img.isPrimary);
  const ordered = primary ? [primary, ...secondary] : secondary;

  ordered.slice(0, SLOT_COUNT).forEach((img, i) => {
    slots[i] = {
      file: null,
      preview: img.url,
      fileName: null,
      fileType: null,
      existingStorageId: img.storageId,
    };
  });

  return slots;
}

export interface UseProductMediaResult {
  images: (string | null)[];
  isProcessing: boolean;
  storageWarning: boolean;
  setImage: (slotIndex: number, file: File) => Promise<void>;
  removeImage: (slotIndex: number) => void;
  clearAll: () => void;
  getFilesForUpload: () => { slotIndex: number; file: File }[];
  /** Storage IDs of existing images that were removed during this edit
   *  session — the caller (submitProduct) needs these to actually delete
   *  the files from Supabase Storage and their product_images rows. */
  getRemovedStorageIds: () => string[];
}

export function useProductMedia(
  existingImages: ExistingImage[] = [],
): UseProductMediaResult {
  const [slots, setSlots] = useState<MediaSlot[]>(() =>
    existingImages.length > 0
      ? slotsFromExisting(existingImages)
      : emptySlots(),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const [removedStorageIds, setRemovedStorageIds] = useState<string[]>([]);

  // Only hydrate from localStorage for brand-new products (no existing
  // images passed in) — an edit session should always reflect real
  // Storage data, never a stale draft from localStorage.
  useEffect(() => {
    if (existingImages.length > 0) return; // editing — already seeded above

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setSlots(
        Array.from({ length: SLOT_COUNT }, (_, i) => ({
          file: null,
          preview:
            typeof parsed[i]?.preview === "string" ? parsed[i].preview : null,
          fileName:
            typeof parsed[i]?.fileName === "string" ? parsed[i].fileName : null,
          fileType:
            typeof parsed[i]?.fileType === "string" ? parsed[i].fileType : null,
          existingStorageId: null,
        })),
      );
    } catch {
      // ignore — falls back to empty slots
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only persist to localStorage for the new-product flow. Persisting an
  // edit session's images to the same shared key would corrupt whatever
  // draft a different new-product session had in progress.
  useEffect(() => {
    if (existingImages.length > 0) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          slots.map((s) => ({
            preview: s.preview,
            fileName: s.fileName,
            fileType: s.fileType,
          })),
        ),
      );
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
      console.warn(
        "[useProductMedia] localStorage write failed — storage quota likely exceeded.",
      );
    }
  }, [slots, existingImages.length]);

  const images = slots.map((s) => s.preview);

  const setImage = useCallback(async (slotIndex: number, file: File) => {
    if (slotIndex < 0 || slotIndex >= SLOT_COUNT) return;
    if (!file.type.startsWith("image/")) return;

    setIsProcessing(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setSlots((prev) => {
        const next = [...prev];
        const replaced = next[slotIndex];

        // Replacing a slot that held an existing Storage image — mark
        // that image as removed so submitProduct can clean it up.
        if (replaced.existingStorageId) {
          setRemovedStorageIds((ids) => [...ids, replaced.existingStorageId!]);
        }

        next[slotIndex] = {
          file,
          preview: dataUrl,
          fileName: file.name,
          fileType: file.type,
          existingStorageId: null,
        };
        return next;
      });
    } catch (err) {
      console.error("[useProductMedia] Could not read image:", err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const removeImage = useCallback((slotIndex: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const removed = next[slotIndex];
      if (removed.existingStorageId) {
        setRemovedStorageIds((ids) => [...ids, removed.existingStorageId!]);
      }
      next[slotIndex] = {
        file: null,
        preview: null,
        fileName: null,
        fileType: null,
        existingStorageId: null,
      };
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSlots(emptySlots());
    setRemovedStorageIds([]);
    if (existingImages.length === 0) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFilesForUpload = useCallback(() => {
    return slots
      .map((s, slotIndex) => {
        if (s.file) return { slotIndex, file: s.file };
        // Skip slots that are unchanged existing images — nothing new to
        // upload for those. Only genuinely new local files get returned.
        return null;
      })
      .filter((s): s is { slotIndex: number; file: File } => s !== null);
  }, [slots]);

  const getRemovedStorageIds = useCallback(
    () => removedStorageIds,
    [removedStorageIds],
  );

  return {
    images,
    isProcessing,
    storageWarning,
    setImage,
    removeImage,
    clearAll,
    getFilesForUpload,
    getRemovedStorageIds,
  };
}
