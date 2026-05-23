import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let refreshPromise: Promise<string | null> | null = null;

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
    }

);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";

    if (!originalRequest || status !== 401 || originalRequest._retry || requestUrl.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(error);
      }

      refreshPromise = refreshClient
        .post("/auth/refresh-token", { refreshToken })
        .then((res) => {
          const payload = res.data?.data ?? res.data;
          const newAccessToken = payload?.accessToken ?? null;
          const newRefreshToken = payload?.refreshToken ?? refreshToken;

          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
          }
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
          return newAccessToken;
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const accessToken = await refreshPromise;
    if (!accessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient(originalRequest);
  },
);

export default apiClient;
