"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDeleteBlog } from "../../hooks/useBlogMutation";

const BlogCard = ({ blog }) => {
  const { user } = useAuth();
  const deleteMutation = useDeleteBlog();
  const img =
    blog.documents?.[0]?.url ||
    "https://placehold.co/300x200?text=Blog";

  const handleDelete = () => {
    if (!blog?._id) return;
    if (!confirm("Delete this blog?")) return;
    deleteMutation.mutate(blog._id);
  };

  return (
    <div
      className="flex h-[360px] w-full min-w-[280px] max-w-[320px] flex-col rounded-3xl border border-blue-100 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
    >
      <div className="relative mb-3 h-[162px] w-full overflow-hidden rounded-2xl bg-slate-100">
        <Image
          className="object-cover"
          src={img}
          alt={blog.title || "Blog cover"}
          fill
          sizes="(max-width: 768px) 280px, 320px"
        />
      </div>

      <p className="text-[11px] text-gray-400 mb-1 font-bold tracking-wide">
        {new Date(blog.createdAt).toLocaleDateString("en-GB")}
      </p>

      <h3 className="mb-1 line-clamp-2 text-base font-bold leading-snug text-custom-blue">
        {blog.title}
      </h3>

      <p className="text-[11px] text-letter1 line-clamp-2 mb-2 font-bold tracking-wide">
        {blog.content?.[0]?.body?.slice(0, 80) ||
          blog.content?.slice(0, 80)}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3">
        <Link
          href={`/blogs/${blog.slug}`}
          className="text-[0.8rem] font-bold text-blue-600"
        >
          <span className="inline-flex items-center">
              Read More
              <ArrowRight className="ml-2 w-5 h-5" />
            </span>
        </Link>

        {user?.role === "admin" && (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/blog/edit/${blog._id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100"
              aria-label={`Edit ${blog.title}`}
            >
              <Pencil size={16} />
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              aria-label={`Delete ${blog.title}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
