// src/components/settings/imageUploadTile.tsx
//
// Generic click/drag-drop image upload tile, extracted from
// categoryImageTile.tsx so hero + gallery settings can reuse the same
// interaction without hardcoding "category" copy.
"use client";
import React, { useRef, useState, DragEvent } from "react";
import { BiImageAdd } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { ImageUploadTileWrap } from "./settings.styles";

interface ImageUploadTileProps {
  image: string | null;
  onFile: (file: File) => void;
  onRemove: () => void;
  isUploading: boolean;
  alt: string;
  size?: number;
}

const ImageUploadTile = ({
  image,
  onFile,
  onRemove,
  isUploading,
  alt,
  size,
}: ImageUploadTileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    if (!image && !isUploading) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
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
    if (file && file.type.startsWith("image/")) onFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <ImageUploadTileWrap
      $size={size}
      className={`${isDragOver ? "drag-over" : ""} ${image ? "has-image" : ""}`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      aria-label={`Upload ${alt}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        tabIndex={-1}
      />

      {isUploading ? (
        <div className="empty-state">
          <span className="hint-text">Uploading…</span>
        </div>
      ) : image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} />
          <button
            type="button"
            className="remove-btn"
            onClick={handleRemove}
            aria-label={`Remove ${alt}`}
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
    </ImageUploadTileWrap>
  );
};

export default ImageUploadTile;
