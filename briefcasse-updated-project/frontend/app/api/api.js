import axios from "axios";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? `${(
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://brief-ewyr.onrender.com"
      ).replace(/\/$/, "")}/api`
    : "/api";

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // cookie auth only
  timeout: 15000,
});

/* ------------------------------
   RESPONSE INTERCEPTOR
   (global error handling optional)
--------------------------------*/
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     // Example: if session expired
//     if (err?.response?.status === 401) {
//       console.log("Session expired");
//     }
//     return Promise.reject(err);
//   }
// );

api.interceptors.response.use(
  res => res,
  async (error) => {
    const config = error.config;

    if (!config || config.__retry) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;

    const shouldRetry =
      !status || status === 502 || status === 503 || status === 504;

    if (shouldRetry) {
      config.__retry = true;

      await new Promise(r => setTimeout(r, 1500));
      return api(config);
    }

    return Promise.reject(error);
  }
);
