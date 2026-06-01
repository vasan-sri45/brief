import { api } from "./client";

export async function fetchSelling() {
  const { data } = await api.get("/selling");
  
  return Array.isArray(data) ? data : data?.selling ?? [];
}
