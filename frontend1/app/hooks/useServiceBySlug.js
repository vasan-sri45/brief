"use client";

import { useServiceBySlug as useServiceBySlugQuery } from "./useServices";

export const useServiceBySlug = (slug, options = {}) => {
  const query = useServiceBySlugQuery(slug, options);

  return {
    ...query,
    service: query.data,
  };
};
