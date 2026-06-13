"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import { setBlogsCache } from "../store/features/cache.slice";

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await api.post("/admin/blogs", formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        alert("Blog title already exists. Try another title.");
      } else {
        alert("Something went wrong.");
      }
    },
  });
};

export const useGetBlogs = (page = 1, limit = 10) => {
  const dispatch = useDispatch();
  const cacheKey = `${page}:${limit}`;
  const cachedBlogs = useSelector((state) => state.cache.blogs[cacheKey]);
  const initialData = cachedBlogs || { success: true, data: [], meta: {} };

  const query = useQuery({
    queryKey: ["blogs", page, limit],
    queryFn: async () => {
      const res = await api.get(`/blogs?page=${page}&limit=${limit}`);
      return res.data;
    },
    initialData,
    placeholderData: initialData,
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (query.data && query.data !== cachedBlogs) {
      dispatch(setBlogsCache({ key: cacheKey, data: query.data }));
    }
  }, [cacheKey, cachedBlogs, dispatch, query.data]);

  return {
    ...query,
    data: query.data || cachedBlogs || initialData,
    isError: false,
  };
};
