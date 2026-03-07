"use client";

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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const isEditMode = Boolean(initialData);

  /* ================= PREFILL (EDIT MODE) ================= */
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setContent(initialData.content || "");
      setPreview(initialData.image || null);
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
      image,
    });
  };

  return (
    <div className="mx-auto py-2 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full lg:w-10/12">

      {/* ================= LEFT : FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#F1F5FF] border border-blue-100 rounded-xl shadow-md p-6 space-y-6"
      >
        <h2 className="text-xl font-bold text-[#1E3A8A]">
          {isEditMode ? "Edit Blog" : "Create Blog"}
        </h2>

        {/* TITLE */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Blog Title
          </label>
          <input
            className="w-full mt-1 border border-slate-300 rounded px-4 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-400 outline-none"
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
            className="w-full mt-1 border border-slate-300 rounded px-4 py-2 bg-slate-100 text-slate-600"
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
            className="w-full mt-1 border border-slate-300 rounded px-4 py-2 h-40 resize-none bg-white text-slate-800 focus:ring-2 focus:ring-blue-400 outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 block">
            Featured Image
          </label>

          <label className="flex flex-col items-center justify-center w-full h-40
            border-2 border-dashed border-blue-300 rounded-lg bg-white
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
        <div className="flex justify-end gap-3 pt-2">
          {isEditMode && (
            <button
              type="button"
              onClick={onCancel}
              className="border border-slate-300 px-6 py-2 rounded text-slate-700 hover:bg-slate-100"
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
  className={`px-6 py-2 rounded transition text-white 
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
      <div className="bg-[#F1F5FF] border border-blue-100 rounded-xl shadow-md p-6">
        <h3 className="font-bold text-[#1E3A8A] mb-4">
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
          {title || "Blog title"}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          /{slug || "blog-slug"}
        </p>

        <p className="mt-4 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
          {content || "Blog content preview..."}
        </p>
      </div>
    </div>
  );
}
