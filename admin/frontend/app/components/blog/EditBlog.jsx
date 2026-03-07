"use client";

import BlogForm from "./BlogForm";

export default function EditBlog({ blog, onClose }) {
  const handleUpdate = async (payload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    if (payload.image) {
      formData.append("image", payload.image);
    }

    console.log("UPDATE BLOG", payload);
    // await api.put(`/admin/blogs/${blog._id}`, formData);

    onClose?.();
  };

  return (
    <BlogForm
      initialData={blog}
      onSubmit={handleUpdate}
      onCancel={onClose}
    />
  );
}
