"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchServiceBySlug, fetchServiceMenu } from "../api/services.api";

export const serviceQueryKeys = {
  all: ["services"],
  menu: () => [...serviceQueryKeys.all, "menu"],
  detail: (slug) => [...serviceQueryKeys.all, "detail", slug],
};

const groupMenuByTitle = (items = []) =>
  items.reduce((groups, item) => {
    if (!item?.title || !item?.heading || !item?.slug) return groups;

    if (!groups[item.title]) {
      groups[item.title] = [];
    }

    groups[item.title].push({
      subTitle: item.subTitle || "",
      heading: item.heading,
      slug: item.slug,
    });

    return groups;
  }, {});

export function useServiceMenu() {
  return useQuery({
    queryKey: serviceQueryKeys.menu(),
    queryFn: fetchServiceMenu,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    select: groupMenuByTitle,
  });
}

export function useServiceBySlug(slug, options = {}) {
  return useQuery({
    queryKey: serviceQueryKeys.detail(slug),
    queryFn: () => fetchServiceBySlug(slug),
    enabled: Boolean(slug) && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    initialData: options.initialData,
  });
}
