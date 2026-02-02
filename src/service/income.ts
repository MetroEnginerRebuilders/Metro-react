import axios from "axios";
import type { Income, IncomeFormData, IncomeApiResponse, GetIncomeListParams } from "../type/income";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getIncomeListApi = async (params: GetIncomeListParams): Promise<IncomeApiResponse<Income[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/income`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createIncomeApi = async (data: IncomeFormData): Promise<IncomeApiResponse<Income>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/income`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateIncomeApi = async (id: string, data: IncomeFormData): Promise<IncomeApiResponse<Income>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/income/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteIncomeApi = async (id: string, financeTypeCode: string = "INCOME"): Promise<IncomeApiResponse<null>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/income/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      financeTypeCode,
    },
  });
  return response.data;
};
