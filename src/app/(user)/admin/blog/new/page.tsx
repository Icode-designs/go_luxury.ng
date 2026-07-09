import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import BlogPostForm from "@/components/user/blog/blogPostForm";
import React from "react";

const page = () => {
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>New blog post</h1>
      </AdminHeaderBox>
      <div className="content">
        <BlogPostForm />
      </div>
    </AdminContentBox>
  );
};

export default page;
