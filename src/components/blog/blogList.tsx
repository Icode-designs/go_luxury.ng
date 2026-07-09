import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/getBlogPosts";
import { BlogGrid, BlogCard, EmptyBlogBox } from "./blog.styles";

function formatPostDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const BlogList = ({ posts }: { posts: BlogPostSummary[] }) => {
  if (posts.length === 0) {
    return (
      <EmptyBlogBox>
        <h2>No posts yet</h2>
        <p>Check back soon for hair care tips, styling guides, and news.</p>
      </EmptyBlogBox>
    );
  }

  return (
    <BlogGrid>
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.id}`} passHref legacyBehavior>
          <BlogCard>
            <div className="blog-image-wrap">
              {post.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverImageUrl} alt={post.title} />
              ) : null}
            </div>
            <span className="blog-date">{formatPostDate(post.publishedAt)}</span>
            <h2>{post.title}</h2>
            {post.excerpt && <p>{post.excerpt}</p>}
          </BlogCard>
        </Link>
      ))}
    </BlogGrid>
  );
};

export default BlogList;
