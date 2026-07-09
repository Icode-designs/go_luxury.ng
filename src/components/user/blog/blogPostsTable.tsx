"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import type { AdminBlogPostRow } from "@/lib/blog/getBlogPostsForAdmin";
import { AdminHeaderInputBox } from "../user.styles";
import { ToolbarWrap, FilterPill, TableWrap, StatusPill, EmptyStateBox } from "./blog.styles";

type StatusFilter = "all" | "draft" | "published";

interface BlogPostsTableProps {
  initialPosts: AdminBlogPostRow[];
}

const BlogPostsTable = ({ initialPosts }: BlogPostsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return initialPosts.filter((post) => {
      const matchesSearch = term.length === 0 || post.title.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialPosts, searchTerm, statusFilter]);

  return (
    <div>
      <ToolbarWrap>
        <AdminHeaderInputBox>
          <div>
            <input
              type="text"
              placeholder="Search posts…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoIosSearch />
          </div>
        </AdminHeaderInputBox>

        <div>
          {(["all", "draft", "published"] as const).map((status) => (
            <FilterPill
              key={status}
              type="button"
              $active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "All" : status === "draft" ? "Draft" : "Published"}
            </FilterPill>
          ))}
        </div>
      </ToolbarWrap>

      {filtered.length === 0 ? (
        <TableWrap>
          <EmptyStateBox>
            {initialPosts.length === 0
              ? "No blog posts yet."
              : "No posts match your search/filter."}
          </EmptyStateBox>
        </TableWrap>
      ) : (
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Published</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/blog/${post.id}`}>{post.title}</Link>
                  </td>
                  <td>{post.authorEmail ?? "—"}</td>
                  <td>
                    <StatusPill $status={post.status}>{post.status}</StatusPill>
                  </td>
                  <td>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                  <td>
                    {new Date(post.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  );
};

export default BlogPostsTable;
