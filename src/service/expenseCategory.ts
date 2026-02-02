import axios from "axios";
import type { ExpenseCategoryListResponse } from "../type/expenseCategory";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getExpenseCategoryListApi = async (): Promise<ExpenseCategoryListResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/finance-categories/expense`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
