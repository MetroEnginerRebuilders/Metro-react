import axios from "axios";
import type { Customer, CustomerFormData, CustomerApiResponse, GetCustomerListParams } from "../type/customer";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCustomerListApi = async (params: GetCustomerListParams): Promise<CustomerApiResponse<Customer[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/customer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createCustomerApi = async (data: CustomerFormData): Promise<CustomerApiResponse<Customer>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/customer`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCustomerApi = async (id: string, data: CustomerFormData): Promise<CustomerApiResponse<Customer>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/customer/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteCustomerApi = async (id: string): Promise<CustomerApiResponse<null>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/customer/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
