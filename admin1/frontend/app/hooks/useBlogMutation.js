"use client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await api.post("/admin/blogs", formData);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["blog"]);
    },

    onError: (error) => {
      if (error.response?.status === 409) {
        alert("❌ Blog title already exists! Try another title.");
      } else {
        alert("Something went wrong!");
      }
    }
  });
};


// export const useGetBlogs = () => {
//   return useQuery({
//     queryKey: ["blogs"],
//     queryFn: async () => {
//       const res = await api.get("/blogs");
//       return res.data; // { success, meta, users }
//     },
//     staleTime: 60_000,
//     refetchOnWindowFocus: false,
//   });
// };


// export const useGetBlogs = (page = 1, limit = 10) =>
//   useQuery({
//     queryKey: ["blogs", page, limit],
//     queryFn: async () => {
//       const res = await api.get(`/blogs?page=${page}&limit=${limit}`);
//       return res.data.data || [];
//     },
//     staleTime: 60_000,
//     refetchOnWindowFocus: false,
//   });



export const useGetBlogs = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ["blogs", page, limit],
    queryFn: async () => {
      const res = await api.get(`/blogs?page=${page}&limit=${limit}`);
      return res.data; // 👈 returns { success, meta, data }
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });


  
  export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/admin/blogs/${id}`);
      return res.data;
    },

    onSuccess: () => {
      // refresh blog lists
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },

    onError: () => {
      alert("❌ Failed to delete blog");
    },
  });
};