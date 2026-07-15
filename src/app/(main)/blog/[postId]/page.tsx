import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostById } from "@/lib/blog/getBlogPostById";
import {
  BlogDetailSection,
  BlogDetailContainer,
  BackLink,
  BlogDetailHeader,
  BlogCoverImage,
} from "@/components/blog/blog.styles";
import { RichTextContent } from "@/styles/components.styled";

interface BlogPostPageProps {
  params: Promise<{ postId: string }>;
}

function formatPostDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await getBlogPostById(postId);

  if (!post) {
    return { title: "Post Not Found" };
  }

  // post.body is sanitized HTML (see getBlogPostById.ts) -- strip the tags
  // for the plain-text meta description fallback so raw markup never leaks
  // into search results/social previews.
  const bodyAsPlainText = post.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  return {
    title: `${post.title} | Go_LuxuryHair.NG Blog`,
    description: post.excerpt?.slice(0, 160) || bodyAsPlainText.slice(0, 160),
    openGraph: {
      title: post.title,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { postId } = await params;
  const post = await getBlogPostById(postId);

  if (!post) {
    notFound();
  }

  return (
    <BlogDetailSection>
      <BlogDetailContainer>
        <Link href="/blog" passHref legacyBehavior>
          <BackLink>&larr; Back to blog</BackLink>
        </Link>

        <BlogDetailHeader>
          <span className="blog-date">{formatPostDate(post.publishedAt)}</span>
          <h1>{post.title}</h1>
        </BlogDetailHeader>

        {post.coverImageUrl && (
          <BlogCoverImage>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImageUrl} alt={post.title} />
          </BlogCoverImage>
        )}

        {/* post.body is sanitized to a fixed safe-tag allowlist in
            getBlogPostById.ts (both on save and on every read) -- see
            sanitizeRichText.ts. Never render unsanitized HTML this way. */}
        <RichTextContent dangerouslySetInnerHTML={{ __html: post.body }} />
      </BlogDetailContainer>
    </BlogDetailSection>
  );
}
