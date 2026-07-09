import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog/getBlogPosts";
import BlogList from "@/components/blog/blogList";
import { BlogSection, BlogContainer, BlogHeaderRow } from "@/components/blog/blog.styles";

export const metadata: Metadata = {
  title: "Blog | Go_LuxuryHair.NG",
  description:
    "Hair care tips, styling guides, and news from Go_LuxuryHair.NG.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <BlogSection>
      <BlogContainer>
        <BlogHeaderRow>
          <h1>Blog</h1>
          <p>Hair care tips, styling guides, and news.</p>
        </BlogHeaderRow>
        <BlogList posts={posts} />
      </BlogContainer>
    </BlogSection>
  );
}
