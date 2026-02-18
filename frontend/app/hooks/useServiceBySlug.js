// src/hooks/useServiceBySlug.js
"use client";

import { useAllServices } from "./userServiceList";

export const useServiceBySlug = (slug) => {
  const query = useAllServices();

  const service =
    slug && query.data?.items
      ? query.data.items.find((s) => s.slug === slug)
      : undefined;

  return {
    ...query,
    service
  };
};
