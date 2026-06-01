"use client";

import EditBlog from "../../../../components/blog/EditBlog";
import { useGetBlogs } from "../../../../hooks/useBlogMutation";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { data, isLoading, isError } = useGetBlogs(1, 100);
  const blog = data?.data?.find((item) => item._id === params.id);

  if (isLoading) return <div className="p-6 font-semibold text-gray-500">Loading blog...</div>;
  if (isError || !blog) return <div className="p-6 font-semibold text-red-600">Blog not found.</div>;

  return <EditBlog blog={blog} onClose={() => {}} />;
}
