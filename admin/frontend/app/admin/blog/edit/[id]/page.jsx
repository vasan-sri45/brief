// app/admin/blogs/edit/[id]/page.jsx
import EditBlog from "../../../../components/blog/EditBlog";

export default function Page({ params }) {
  const blog = {
    _id: params.id,
    title: "Sample Blog",
    slug: "sample-blog",
    content: "Sample content",
    image: "/demo.jpg",
  };

  return <EditBlog blog={blog} onClose={() => {}} />;
}
