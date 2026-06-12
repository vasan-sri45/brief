import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
});

// optional: request/response interceptors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // central error logging
    // console.error("API error:", err?.response?.data || err.message);
    return Promise.reject(err);
  }
);
