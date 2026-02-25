import axios, { type AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const commonApi = async <T>(
  method: AxiosRequestConfig["method"],
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<{ data: T }> => {
  const response = await axios({
    method,
    url: BASE_URL + url,
    data,
    ...config,
  });
  return response;
};
