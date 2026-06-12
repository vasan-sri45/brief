// src/hooks/useServiceBySlug.js
"use client";

import { useAllServices } from "./userServiceList";
import { serviceMatchesSlug } from "../utils/serviceSlug";

export const useServiceBySlug = (slug, options = {}) => {
  const query = useAllServices(options);

  const service =
    slug && query.data?.items
      ? query.data.items.find((s) => s.slug === slug)
        || query.data.items.find((s) => serviceMatchesSlug(s, slug))
      : undefined;

  return {
    ...query,
    service
  };
};
