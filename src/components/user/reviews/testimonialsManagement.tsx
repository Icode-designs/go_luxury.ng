// src/components/user/reviews/testimonialsManagement.tsx
//
// Admin UI for the 5 fixed homepage "Kind Words" testimonial slots. Each
// slot starts out showing placeholder copy on the public homepage (see
// lib/settings/getTestimonials.ts) until an admin fills it in here — filling
// one slot doesn't require filling the rest, so real testimonials phase in
// one at a time exactly as requested.
"use client";
import { useState } from "react";
import {
  useTestimonialsManagement,
  type ManagedTestimonialSlot,
  type TestimonialSlotInput,
} from "@/hook/useTestimonialsManagement";
import ImageUploadTile from "@/components/settings/imageUploadTile";
import {
  TestimonialSlotGrid,
  TestimonialSlotCard,
  TestimonialSlotHeader,
  TestimonialStatusPill,
  TestimonialForm,
  TestimonialSlotActions,
  TestimonialPhotoRow,
  InlineNote,
} from "./reviews.styles";

function emptyInput(): TestimonialSlotInput {
  return { quote: "", customerName: "", customerLocation: "", rating: 5 };
}

function toInput(slot: ManagedTestimonialSlot): TestimonialSlotInput {
  return {
    quote: slot.quote ?? "",
    customerName: slot.customerName ?? "",
    customerLocation: slot.customerLocation ?? "",
    rating: slot.rating ?? 5,
  };
}

interface SlotFormProps {
  slot: ManagedTestimonialSlot;
  onSave: (values: TestimonialSlotInput) => Promise<void>;
  onClear: () => Promise<void>;
  onPhotoUpload: (file: File) => Promise<void>;
  onPhotoRemove: () => Promise<void>;
  isUploadingPhoto: boolean;
}

const SlotForm = ({
  slot,
  onSave,
  onClear,
  onPhotoUpload,
  onPhotoRemove,
  isUploadingPhoto,
}: SlotFormProps) => {
  const isFilled = slot.quote !== null && slot.customerName !== null;
  const [values, setValues] = useState<TestimonialSlotInput>(
    isFilled ? toInput(slot) : emptyInput(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState<{ text: string; variant: "error" | "success" } | null>(
    null,
  );
  const [photoError, setPhotoError] = useState<string | null>(null);

  async function handlePhotoFile(file: File) {
    setPhotoError(null);
    try {
      await onPhotoUpload(file);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Failed to upload photo.");
    }
  }

  async function handlePhotoRemove() {
    setPhotoError(null);
    try {
      await onPhotoRemove();
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Failed to remove photo.");
    }
  }

  async function handleSave() {
    if (!values.quote.trim() || !values.customerName.trim()) {
      setNote({ text: "Quote and name are required.", variant: "error" });
      return;
    }
    setIsSaving(true);
    setNote(null);
    try {
      await onSave(values);
      setNote({ text: "Saved.", variant: "success" });
    } catch (err) {
      setNote({
        text: err instanceof Error ? err.message : "Failed to save.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleClear() {
    setIsSaving(true);
    setNote(null);
    try {
      await onClear();
      setValues(emptyInput());
      setNote({ text: "Reverted to placeholder.", variant: "success" });
    } catch (err) {
      setNote({
        text: err instanceof Error ? err.message : "Failed to clear.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <TestimonialSlotCard>
      <TestimonialSlotHeader>
        <span className="slot-label">Slot {slot.slotNumber}</span>
        <TestimonialStatusPill $isPlaceholder={!isFilled}>
          {isFilled ? "Live" : "Placeholder"}
        </TestimonialStatusPill>
      </TestimonialSlotHeader>

      <TestimonialPhotoRow>
        <ImageUploadTile
          image={slot.photoUrl}
          isUploading={isUploadingPhoto}
          alt={`testimonial slot ${slot.slotNumber} customer photo`}
          size={72}
          onFile={handlePhotoFile}
          onRemove={handlePhotoRemove}
        />
        <div>
          <span className="photo-hint">Customer photo (optional)</span>
          {photoError && (
            <InlineNote $variant="error">{photoError}</InlineNote>
          )}
        </div>
      </TestimonialPhotoRow>

      <TestimonialForm>
        <label>
          Quote
          <textarea
            rows={3}
            value={values.quote}
            onChange={(e) => setValues((v) => ({ ...v, quote: e.target.value }))}
            placeholder="What the customer said…"
          />
        </label>

        <div className="row">
          <label>
            Customer name
            <input
              type="text"
              value={values.customerName}
              onChange={(e) =>
                setValues((v) => ({ ...v, customerName: e.target.value }))
              }
              placeholder="e.g. ADEBOLA Y"
            />
          </label>
          <label>
            Location
            <input
              type="text"
              value={values.customerLocation}
              onChange={(e) =>
                setValues((v) => ({ ...v, customerLocation: e.target.value }))
              }
              placeholder="e.g. Lagos"
            />
          </label>
        </div>

        <label>
          Rating
          <select
            value={values.rating}
            onChange={(e) =>
              setValues((v) => ({ ...v, rating: Number(e.target.value) }))
            }
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
      </TestimonialForm>

      <TestimonialSlotActions>
        <button
          type="button"
          className="save"
          disabled={isSaving}
          onClick={handleSave}
        >
          Save
        </button>
        {isFilled && (
          <button
            type="button"
            className="clear"
            disabled={isSaving}
            onClick={handleClear}
          >
            Revert to placeholder
          </button>
        )}
        {note && <InlineNote $variant={note.variant}>{note.text}</InlineNote>}
      </TestimonialSlotActions>
    </TestimonialSlotCard>
  );
};

const TestimonialsManagement = () => {
  const {
    slots,
    isLoading,
    error,
    setSlotContent,
    clearSlot,
    setSlotPhoto,
    clearSlotPhoto,
  } = useTestimonialsManagement();
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

  if (isLoading) return <p>Loading testimonials…</p>;
  if (error) return <p style={{ color: "#8B3A2A" }}>{error}</p>;

  async function handlePhotoUpload(slotNumber: number, file: File, previousStorageId: string | null) {
    setUploadingSlot(slotNumber);
    try {
      await setSlotPhoto(slotNumber, file, previousStorageId);
    } finally {
      setUploadingSlot(null);
    }
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "#9A8880", marginBottom: 16, maxWidth: 640 }}>
        The homepage carousel always shows 5 testimonials. Slots you haven&apos;t
        filled in show placeholder copy — fill in a slot to replace it with a
        real customer testimonial, one at a time. A customer photo is optional;
        slots without one fall back to a monogram avatar on the homepage.
      </p>

      <TestimonialSlotGrid>
        {slots.map((slot) => (
          <SlotForm
            key={slot.slotNumber}
            slot={slot}
            onSave={(values) => setSlotContent(slot.slotNumber, values)}
            onClear={() => clearSlot(slot.slotNumber, slot.photoStorageId)}
            onPhotoUpload={(file) =>
              handlePhotoUpload(slot.slotNumber, file, slot.photoStorageId)
            }
            onPhotoRemove={() => {
              if (slot.photoStorageId) {
                return clearSlotPhoto(slot.slotNumber, slot.photoStorageId);
              }
              return Promise.resolve();
            }}
            isUploadingPhoto={uploadingSlot === slot.slotNumber}
          />
        ))}
      </TestimonialSlotGrid>
    </div>
  );
};

export default TestimonialsManagement;
