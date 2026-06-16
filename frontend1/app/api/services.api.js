import { api } from "./api";

export async function fetchServiceMenu() {
  const { data } = await api.get("/services/menu");
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.items) ? data.items : [];
}

export async function fetchServiceBySlug(slug) {
  const { data } = await api.get(`/services/slug/${encodeURIComponent(slug)}`);
  return data;
}
