import axios from "axios";
import type {
  DashboardIncomeExpenseApiResponse,
  DashboardIncomeExpensePayload,
  DashboardYearlyIncomeExpenseApiResponse,
  DashboardYearlyIncomeExpensePayload,
} from "../type/dashboard";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getDashboardIncomeExpenseApi = async (
  payload: DashboardIncomeExpensePayload
): Promise<DashboardIncomeExpenseApiResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/finance/dashboard/income-expense`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: payload,
  });
  return response.data;
};

export const getDashboardYearlyIncomeExpenseApi = async (
  payload: DashboardYearlyIncomeExpensePayload
): Promise<DashboardYearlyIncomeExpenseApiResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/finance/dashboard/income-expense/yearly`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: payload,
  });
  return response.data;
};
