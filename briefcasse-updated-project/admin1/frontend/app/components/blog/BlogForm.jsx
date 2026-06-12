"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";

export default function BlogForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const isEditMode = Boolean(initialData);

  /* ================= PREFILL (EDIT MODE) ================= */
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setContent(initialData.content || "");
      setMetaTitle(initialData.metaTitle || "");
      setMetaDescription(initialData.metaDescription || "");
      setTags(Array.isArray(initialData.tags) ? initialData.tags.join(", ") : initialData.tags || "");
      setPreview(initialData.documents?.[0]?.url || initialData.image || null);
    }
  }, [initialData]);

  /* ================= SLUG AUTO (CREATE ONLY) ================= */
  useEffect(() => {
    if (isEditMode) return;

    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setSlug(generatedSlug);
  }, [title, isEditMode]);

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      tags,
      image,
    });
  };

  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-6 py-2 lg:grid-cols-2">

      {/* ================= LEFT : FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
      >
        <h2 className="text-2xl font-bold text-custom-blue">
          {isEditMode ? "Edit Blog" : "Create Blog"}
        </h2>

        {/* TITLE */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Blog Title
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* SLUG */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Slug
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
            value={slug}
            readOnly
          />
        </div>

        {/* CONTENT */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Content
          </label>
          <textarea
            className="mt-1 h-56 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-300"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-blue-700">
            SEO Settings
          </h3>

          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Meta Title
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-300"
                value={metaTitle}
                maxLength={70}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Search-friendly page title"
              />
              <p className="mt-1 text-xs text-slate-400">
                {metaTitle.length}/70 characters
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Meta Description
              </label>
              <textarea
                className="mt-1 h-24 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-300"
                value={metaDescription}
                maxLength={180}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Short search result description"
              />
              <p className="mt-1 text-xs text-slate-400">
                {metaDescription.length}/180 characters
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Tags
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-300"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="trademark, gst, compliance"
              />
            </div>
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 block">
            Featured Image
          </label>

          <label className="flex h-44 w-full flex-col items-center justify-center
            rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40
            cursor-pointer hover:bg-blue-50 transition"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {!preview ? (
              <>
                <svg
                  className="w-10 h-10 text-blue-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
                  />
                </svg>
                <p className="text-sm font-medium text-slate-600">
                  Click to upload image
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG, JPEG
                </p>
              </>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover rounded-lg"
              />
            )}
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col justify-end gap-3 pt-2 sm:flex-row">
          {isEditMode && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          )}

          {/* <button
            type="submit"
            className="bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-2 rounded transition"
          >
            {isEditMode ? "Update Blog" : "Publish Blog"}
          </button> */}

          <button
  type="submit"
  disabled={loading}
  className={`rounded-xl px-6 py-3 font-semibold transition text-white 
              ${loading 
                ? "bg-blue-300 cursor-not-allowed" 
                : "bg-[#2563EB] hover:bg-[#1E40AF]"}`}
>
  {loading
    ? "Uploading..."
    : isEditMode
      ? "Update Blog"
      : "Publish Blog"
  }
</button>


        </div>
      </form>

      {/* ================= RIGHT : PREVIEW ================= */}
      <div className="rounded-3xl border border-blue-100 bg-[#F8FBFF] p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
        <h3 className="mb-4 font-bold text-custom-blue">
          Live Preview
        </h3>

        {preview && (
          <img
            src={preview}
            className="rounded-lg mb-4 w-full h-48 object-cover border"
            alt="Preview"
          />
        )}

        <h2 className="text-lg font-bold text-slate-800">
          {metaTitle || title || "Blog title"}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          /{slug || "blog-slug"}
        </p>

        {metaDescription && (
          <p className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600">
            {metaDescription}
          </p>
        )}

        {tags && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="mt-4 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
          {content || "Blog content preview..."}
        </p>
      </div>
    </div>
  );
}
