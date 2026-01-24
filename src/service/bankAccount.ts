import axios from "axios";
import type { BankAccount, BankAccountFormData, BankAccountApiResponse, GetBankAccountListParams } from "../type/bankAccount";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getBankAccountListApi = async (params: GetBankAccountListParams): Promise<BankAccountApiResponse<BankAccount[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/bank-account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createBankAccountApi = async (data: BankAccountFormData): Promise<BankAccountApiResponse<BankAccount>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/bank-account`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateBankAccountApi = async (id: string, data: BankAccountFormData): Promise<BankAccountApiResponse<BankAccount>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/bank-account/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteBankAccountApi = async (id: string): Promise<BankAccountApiResponse<null>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/bank-account/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
