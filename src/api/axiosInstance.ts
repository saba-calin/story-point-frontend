import axios from "axios";
import {PUBLIC_ENDPOINTS} from "../util/types.ts";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

let accessTokenExpiresAt: number | null = null;
let refreshPromise: Promise<any> | null = null;

export function setAccessTokenExpiry(durationSeconds: number) {
  accessTokenExpiresAt = Date.now() + durationSeconds * 1000;
}

function getRefreshPromise() {
  if (!refreshPromise) {
    refreshPromise = axiosInstance.post("/auth/refresh")
      .then((res) => {
        setAccessTokenExpiry(res.data.userContext.accessTokenDuration)
      })
      .catch((error) => {
        accessTokenExpiresAt = null;
        window.location.href = "/log-in";
        return Promise.reject(error)
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

axiosInstance.interceptors.request.use(async (config) => {
  if (PUBLIC_ENDPOINTS.includes(config.url ?? "")) {
    return config;
  }

  if (!accessTokenExpiresAt || accessTokenExpiresAt - Date.now() < 60_000) {
    await getRefreshPromise();
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !PUBLIC_ENDPOINTS.includes(originalRequest.url ?? "")) {
      originalRequest._retry = true;
      await getRefreshPromise();
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
