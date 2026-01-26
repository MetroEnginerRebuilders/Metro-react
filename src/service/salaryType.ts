import axios from "axios";
import type { SalaryTypeListResponse } from "../type/salaryType";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getSalaryTypeListApi = async (): Promise<SalaryTypeListResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/salary-types`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
