import axios from "axios";
import type { Company, CompanyFormData, CompanyApiResponse, GetCompanyListParams } from "../type/company";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCompanyListApi = async (params: GetCompanyListParams): Promise<CompanyApiResponse<Company[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/company`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createCompanyApi = async (data: CompanyFormData): Promise<CompanyApiResponse<Company>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/company`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCompanyApi = async (id: string, data: CompanyFormData): Promise<CompanyApiResponse<Company>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/company/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteCompanyApi = async (id: string): Promise<CompanyApiResponse<null>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/company/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
