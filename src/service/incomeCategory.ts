import axios from "axios";
import type { IncomeCategoryListResponse } from "../type/incomeCategory";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getIncomeCategoryListApi = async (): Promise<IncomeCategoryListResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/finance-categories/income`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
