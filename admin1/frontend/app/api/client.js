import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 10000,
  // withCredentials: true, // auth cookies இருந்தால் uncomment
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
