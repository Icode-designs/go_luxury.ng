"use client";
import { useActionState, useRef, useState } from "react";
import { InputBox } from "@/styles/auth.styles";
import { FormError, FieldError } from "@/styles/auth-error.styles";
import Button from "@/components/ui/button";
import RichTextEditor from "@/components/settings/richTextEditor";
import ImageUploadTile from "@/components/settings/imageUploadTile";
import { createClient } from "@/lib/supabase/client";
import {
  submitBlogPostAction,
  type SubmitBlogPostState,
} from "@/lib/blog/submitBlogPost";
import type { AdminBlogPostDetail } from "@/lib/blog/getBlogPostForAdmin";
import { PostForm, FormActionsRow, FieldBox } from "./blog.styles";

interface BlogPostFormProps {
  post?: AdminBlogPostDetail;
}

const initialState: SubmitBlogPostState = { status: "idle" };

const BlogPostForm = ({ post }: BlogPostFormProps) => {
  const boundAction = submitBlogPostAction.bind(null, post?.id);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);
  // The rich text editor's surface is contentEditable, not a native form
  // field -- its HTML is mirrored into this hidden input on every change so
  // the native <form action={formAction}> submission still picks it up
  // under name="body", same as every other field here.
  const [body, setBody] = useState(post?.body ?? "");

  // Cover image is uploaded straight to Supabase Storage (blog-images
  // bucket) from the browser, same convention as hero/category/gallery/
  // testimonial images -- the resulting public URL + storage path are just
  // mirrored into hidden inputs so the existing Server Action still saves
  // them together with the rest of the post on submit. A brand-new post
  // has no id yet, so a stable per-form draft id is used as the storage
  // folder until the post is actually created.
  const draftIdRef = useRef(post?.id ?? crypto.randomUUID());
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [coverImageStorageId, setCoverImageStorageId] = useState<string | null>(
    post?.coverImageStorageId ?? null,
  );
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  async function handleCoverFile(file: File) {
    setIsUploadingCover(true);
    setCoverError(null);
    try {
      const supabase = createClient();

      if (coverImageStorageId) {
        await supabase.storage.from("blog-images").remove([coverImageStorageId]);
      }

      const ext = file.name.split(".").pop();
      const storagePath = `${draftIdRef.current}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(storagePath);

      setCoverImageUrl(urlData.publicUrl);
      setCoverImageStorageId(storagePath);
    } catch (err) {
      setCoverError(
        err instanceof Error ? err.message : "Failed to upload image.",
      );
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleCoverRemove() {
    setCoverError(null);
    if (coverImageStorageId) {
      try {
        const supabase = createClient();
        await supabase.storage.from("blog-images").remove([coverImageStorageId]);
      } catch {
        // Non-fatal — worst case an orphaned file remains in storage.
      }
    }
    setCoverImageUrl("");
    setCoverImageStorageId(null);
  }

  return (
    <PostForm action={formAction}>
      {state.status === "error" && (
        <FormError role="alert">{state.message}</FormError>
      )}

      <fieldset disabled={isPending}>
        <InputBox>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={post?.title}
          />
          {fieldErrors?.title && <FieldError>{fieldErrors.title[0]}</FieldError>}
        </InputBox>

        <InputBox>
          <label htmlFor="excerpt">Excerpt (optional)</label>
          <input
            id="excerpt"
            name="excerpt"
            type="text"
            defaultValue={post?.excerpt}
            placeholder="Short summary shown in blog listings"
          />
          {fieldErrors?.excerpt && <FieldError>{fieldErrors.excerpt[0]}</FieldError>}
        </InputBox>

        <FieldBox>
          <label>Cover image (optional)</label>
          <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
          <input
            type="hidden"
            name="coverImageStorageId"
            value={coverImageStorageId ?? ""}
          />
          <ImageUploadTile
            image={coverImageUrl || null}
            onFile={handleCoverFile}
            onRemove={handleCoverRemove}
            isUploading={isUploadingCover}
            alt="Blog post cover image"
            size={160}
          />
          {coverError && <FieldError>{coverError}</FieldError>}
          {fieldErrors?.coverImageUrl && (
            <FieldError>{fieldErrors.coverImageUrl[0]}</FieldError>
          )}
        </FieldBox>

        <FieldBox>
          <label htmlFor="body">Body</label>
          <input type="hidden" name="body" value={body} />
          <RichTextEditor
            id="body"
            value={body}
            onChange={setBody}
            placeholder="Write the post here…"
          />
          {fieldErrors?.body && <FieldError>{fieldErrors.body[0]}</FieldError>}
        </FieldBox>

        <InputBox>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={post?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </InputBox>
      </fieldset>

      <FormActionsRow>
        <Button variant="filled-nude" type="submit" disabled={isPending}>
          {isPending ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
      </FormActionsRow>
    </PostForm>
  );
};

export default BlogPostForm;
