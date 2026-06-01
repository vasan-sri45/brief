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

      console.log("Server cold start... retrying");

      await new Promise(r => setTimeout(r, 4000));
      return api(config);
    }

    return Promise.reject(error);
  }
);
