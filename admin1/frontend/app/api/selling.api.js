import { api } from "./client";

export async function fetchSelling() {
  const { data } = await api.get("/paid");
  
  return Array.isArray(data) ? data : data?.data ?? data?.selling ?? [];
}
