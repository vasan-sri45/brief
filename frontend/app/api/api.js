import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // cookie auth only
  timeout: 60000,
});

/* ------------------------------
   RESPONSE INTERCEPTOR
   (global error handling optional)
--------------------------------*/
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Example: if session expired
    if (err?.response?.status === 401) {
      console.log("Session expired");
    }
    return Promise.reject(err);
  }
);
