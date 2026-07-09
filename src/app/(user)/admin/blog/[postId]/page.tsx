import { notFound } from "next/navigation";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import BlogPostForm from "@/components/user/blog/blogPostForm";
import { getBlogPostForAdmin } from "@/lib/blog/getBlogPostForAdmin";
import React from "react";

interface AdminBlogEditPageProps {
  params: Promise<{ postId: string }>;
}

const page = async ({ params }: AdminBlogEditPageProps) => {
  const { postId } = await params;
  const post = await getBlogPostForAdmin(postId);

  if (!post) {
    notFound();
  }

  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Edit blog post</h1>
      </AdminHeaderBox>
      <div className="content">
        <BlogPostForm post={post} />
      </div>
    </AdminContentBox>
  );
};

export default page;
