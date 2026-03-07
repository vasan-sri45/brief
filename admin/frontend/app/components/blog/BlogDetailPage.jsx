// "use client";

// import React from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { blogs } from "./blog";

// export default function BlogDetailPage() {
//   const { slug } = useParams();

//   const blog = blogs.find((b) => b.slug === slug);
  
//   if (!blog) {
//     return (
//       <div className="py-20 text-center text-gray-500">
//         Blog not found
//       </div>
//     );
//   }

//   return (
//     <main className="w-full bg-[#F7F1DF] py-10 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Title */}
//         <h1 className="font-anton font-normal text-center text-custom-blue text-[1.2rem] md:text-[1.5rem] leading-snug mb-2">
//           {blog.title}
//         </h1>

//         {/* Subtitle */}
//         <p className="text-center font-anton font-normal text-[#1E4484] text-sm mb-6">
//           {blog.subtitle}
//         </p>

//         {/* Featured Image */}
//         <div className="w-full h-[220px] md:h-[322px] bg-[#E0B15F] rounded-md mb-4" />

//         {/* Meta */}
//         <p className="text-[11px] text-gray-500 mb-6">
//           {new Date(blog.date).toLocaleDateString("en-GB")}
//         </p>

//         {/* Content */}
//         <article className="text-[13px] leading-6 text-[#1E1E1E] space-y-6 text-justify">
//           {blog.content.map((section, index) => (
//             <div key={index}>
//               <h3 className="font-bold text-[13px] mb-2">
//                 {section.heading}
//               </h3>
//               <p>{section.body}</p>
//             </div>
//           ))}
//         </article>

//         {/* Navigation */}
//         <div className="flex justify-between items-center mt-10">
//           <Link
//             href={`/blogs/${blog.slug}`}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-starttext text-white text-xs font-semibold"
//           >
//             ← Back to Blogs
//           </Link>

//           <Link
//             href="/blogs/next-blog"
//             className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E3A849] text-white text-xs font-semibold"
//           >
//             Next Blog →
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }
