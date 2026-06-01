// "use client";

// import BlogForm from "./BlogForm";

// export default function CreateBlog() {
//   const handleCreate = async (payload) => {
//     const formData = new FormData();
//     formData.append("title", payload.title);
//     formData.append("slug", payload.slug);
//     formData.append("content", payload.content);
//     if (payload.image) {
//       formData.append("image", payload.image);
//     }

//     console.log("CREATE BLOG", payload);
//     // await api.post("/admin/blogs", formData);
//   };

//   return <BlogForm onSubmit={handleCreate} />;
// }


"use client";

import BlogForm from "./BlogForm";
import { useCreateBlog } from "../../hooks/useBlogMutation";

export default function CreateBlog() {
  const createBlog = useCreateBlog();

  const handleCreate = async (payload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("slug", payload.slug);
    formData.append("content", payload.content);
    if (payload.image) {
      formData.append("documents", payload.image); // your backend expects req.files.documents
    }

    await createBlog.mutateAsync(formData);
  };

  return (
    <BlogForm
      onSubmit={handleCreate}
      loading={createBlog.isPending}
    />
  );
}
