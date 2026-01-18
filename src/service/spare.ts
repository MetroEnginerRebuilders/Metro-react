import axios from "axios";
import type { ApiResponse, GetSpareListParams, Spare, SpareFormData } from "../type/spare";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getSpareListApi = async (params: GetSpareListParams): Promise<ApiResponse<Spare[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/spare`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createSpareApi = async (data: SpareFormData): Promise<ApiResponse<Spare>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/spare`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateSpareApi = async (id: number, data: SpareFormData): Promise<ApiResponse<Spare>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/spare/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteSpareApi = async (id: number): Promise<ApiResponse<null>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/spare/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
