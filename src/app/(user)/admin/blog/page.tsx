import { FaPlus } from "react-icons/fa6";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { StyledLink } from "@/components/user/blog/blog.styles";
import BlogPostsTable from "@/components/user/blog/blogPostsTable";
import { getBlogPostsForAdmin } from "@/lib/blog/getBlogPostsForAdmin";
import React from "react";

const page = async () => {
  const posts = await getBlogPostsForAdmin();
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Blog</h1>
        <StyledLink href="/admin/blog/new">
          <FaPlus />
          <>New post</>
        </StyledLink>
      </AdminHeaderBox>
      <div className="content">
        <BlogPostsTable initialPosts={posts} />
      </div>
    </AdminContentBox>
  );
};

export default page;
