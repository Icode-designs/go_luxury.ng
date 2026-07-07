// src/components/user/products/productMedia.tsx
"use client";
import React, { useRef, useState, useCallback, DragEvent } from "react";
import { ProductMediaBox } from "./products.styles";
import { BiImageAdd } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useProductMedia, type ExistingImage } from "@/hook/useProductMedia";

interface TileProps {
  slotIndex: number;
  image: string | null;
  onFile: (slotIndex: number, file: File) => Promise<void>;
  onRemove: (slotIndex: number) => void;
}

const MediaTile = ({ slotIndex, image, onFile, onRemove }: TileProps) => {
  // ...unchanged, exactly as you have it...
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    if (!image) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(slotIndex, file);
    e.target.value = "";
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFile(slotIndex, file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(slotIndex);
  };

  return (
    <div
      className={`media-tile${isDragOver ? " drag-over" : ""}${image ? " has-image" : ""}`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      aria-label={
        slotIndex === 0
          ? "Upload primary image"
          : `Upload secondary image ${slotIndex}`
      }
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        name={slotIndex === 0 ? "primaryImage" : `secondaryImage${slotIndex}`}
        id={slotIndex === 0 ? "primaryImage" : `secondaryImage${slotIndex}`}
        onChange={handleInputChange}
        tabIndex={-1}
      />

      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={`Product image ${slotIndex + 1}`} />
          <button
            type="button"
            className="remove-btn"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            <IoClose />
          </button>
          <div className="replace-overlay">
            <BiImageAdd />
            <span>Replace</span>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <BiImageAdd />
          <span className="hint-text">
            {isDragOver ? "Drop image here" : "Click or drag & drop"}
          </span>
        </div>
      )}
    </div>
  );
};

interface ProductMediaProps {
  existingImages?: ExistingImage[];
  onMediaHookReady?: (hook: ReturnType<typeof useProductMedia>) => void;
}

const ProductMedia = ({
  existingImages = [],
  onMediaHookReady,
}: ProductMediaProps) => {
  const mediaHook = useProductMedia(existingImages);
  const { images, isProcessing, setImage, removeImage } = mediaHook;

  // Exposes the full hook instance (getFilesForUpload, getRemovedStorageIds)
  // to the parent form, since submitProduct needs both at submit time but
  // this hook must live inside ProductMedia to own the tile state.
  React.useEffect(() => {
    onMediaHookReady?.(mediaHook);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mediaHook.images,
    mediaHook.getFilesForUpload,
    mediaHook.getRemovedStorageIds,
  ]);

  const handleFile = useCallback(
    async (slotIndex: number, file: File) => {
      await setImage(slotIndex, file);
    },
    [setImage],
  );

  return (
    <fieldset>
      <div>
        <h2>Product media</h2>
      </div>

      {isProcessing && (
        <p style={{ fontSize: 12, color: "#745A27" }}>Processing image…</p>
      )}

      <ProductMediaBox>
        {images.map((img, idx) => (
          <MediaTile
            key={idx}
            slotIndex={idx}
            image={img}
            onFile={handleFile}
            onRemove={removeImage}
          />
        ))}
      </ProductMediaBox>
    </fieldset>
  );
};

export default ProductMedia;
