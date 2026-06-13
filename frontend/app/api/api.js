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
  timeout: 5000,
});

const normalizeApiError = (error) => {
  const status = error?.response?.status;
  const isTimeout = error?.code === "ECONNABORTED" || error?.message?.includes("timeout");
  const isNetworkError = !status || error?.message === "Network Error";

  error.isTimeout = isTimeout;
  error.isNetworkError = isNetworkError;
  error.isAuthError = status === 401 || status === 403;
  error.isServerError = status >= 500;
  error.friendlyMessage = error.isAuthError
    ? "Session expired. Please sign in again."
    : error.isServerError
    ? "Server is temporarily unavailable."
    : isTimeout || isNetworkError
    ? "Network is slow. Showing cached data if available."
    : error?.response?.data?.message || "Something went wrong.";

  return error;
};

api.interceptors.response.use(
  res => res,
  async (error) => {
    const normalizedError = normalizeApiError(error);
    const config = normalizedError.config;

    if (!config || config.__retry) {
      return Promise.reject(normalizedError);
    }

    const status = normalizedError?.response?.status;

    const shouldRetry =
      normalizedError.isTimeout ||
      normalizedError.isNetworkError ||
      status === 502 ||
      status === 503 ||
      status === 504;

    if (shouldRetry) {
      config.__retry = true;

      await new Promise(r => setTimeout(r, 800));
      return api(config);
    }

    return Promise.reject(normalizedError);
  }
);
