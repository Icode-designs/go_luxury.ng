"use client";
import { useActionState } from "react";
import { InputBox } from "@/styles/auth.styles";
import { FormError, FieldError } from "@/styles/auth-error.styles";
import Button from "@/components/ui/button";
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
          <textarea
            id="body"
            name="body"
            rows={14}
            required
            defaultValue={post?.body}
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
