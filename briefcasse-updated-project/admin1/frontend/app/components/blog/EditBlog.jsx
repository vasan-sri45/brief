"use client";

import BlogForm from "./BlogForm";
import { useRouter } from "next/navigation";
import { useUpdateBlog } from "../../hooks/useBlogMutation";

export default function EditBlog({ blog, onClose }) {
  const router = useRouter();
  const updateBlog = useUpdateBlog();

  const handleUpdate = async (payload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    formData.append("metaTitle", payload.metaTitle);
    formData.append("metaDescription", payload.metaDescription);
    formData.append("tags", payload.tags);
    if (payload.image) {
      formData.append("documents", payload.image);
    }

    await updateBlog.mutateAsync({
      id: blog._id,
      formData,
    });
    onClose?.();
    router.push("/admin/status");
  };

  return (
    <BlogForm
      initialData={blog}
      onSubmit={handleUpdate}
      onCancel={onClose || (() => router.push("/admin/status"))}
      loading={updateBlog.isPending}
    />
  );
}
