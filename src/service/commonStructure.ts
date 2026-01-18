import axios, { type AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
