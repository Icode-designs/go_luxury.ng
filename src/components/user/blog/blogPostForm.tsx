"use client";
import { useActionState, useState } from "react";
import { InputBox } from "@/styles/auth.styles";
import { FormError, FieldError } from "@/styles/auth-error.styles";
import Button from "@/components/ui/button";
import RichTextEditor from "@/components/settings/richTextEditor";
import {
  submitBlogPostAction,
  type SubmitBlogPostState,
} from "@/lib/blog/submitBlogPost";
import type { AdminBlogPostDetail } from "@/lib/blog/getBlogPostForAdmin";
import { PostForm, FormActionsRow } from "./blog.styles";

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

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

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

        <InputBox>
          <label htmlFor="coverImageUrl">Cover image URL (optional)</label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            type="text"
            defaultValue={post?.coverImageUrl}
            placeholder="https://…"
          />
          {fieldErrors?.coverImageUrl && (
            <FieldError>{fieldErrors.coverImageUrl[0]}</FieldError>
          )}
        </InputBox>

        <InputBox>
          <label htmlFor="body">Body</label>
          <input type="hidden" name="body" value={body} />
          <RichTextEditor
            id="body"
            value={body}
            onChange={setBody}
            placeholder="Write the post here…"
          />
          {fieldErrors?.body && <FieldError>{fieldErrors.body[0]}</FieldError>}
        </InputBox>

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
