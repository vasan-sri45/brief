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

    // retry only once
    if (!config || config.__retry) {
      return Promise.reject(error);
    }

    // network error OR 502 OR 503 OR timeout
    if (!error.response || error.code === "ECONNABORTED" || error.response?.status >= 500) {
      config.__retry = true;

      console.log("Server waking up... retrying in 3s");

      await new Promise(r => setTimeout(r, 3000));
      return api(config);
    }

    return Promise.reject(error);
  }
);