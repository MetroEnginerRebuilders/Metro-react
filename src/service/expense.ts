import axios from "axios";
import type { Expense, ExpenseFormData, ExpenseApiResponse, GetExpenseListParams } from "../type/expense";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getExpenseListApi = async (params: GetExpenseListParams): Promise<ExpenseApiResponse<Expense[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/expense`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createExpenseApi = async (data: ExpenseFormData): Promise<ExpenseApiResponse<Expense>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/expense`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateExpenseApi = async (id: string, data: ExpenseFormData): Promise<ExpenseApiResponse<Expense>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/expense/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteExpenseApi = async (id: string, financeTypeCode: string = "EXPENSE"): Promise<ExpenseApiResponse<null>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/expense/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      financeTypeCode,
    },
  });
  return response.data;
};
