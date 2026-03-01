import axios from "axios";
import type {
  DashboardExpenseDateRangeApiResponse,
  DashboardExpenseDateRangePayload,
  DashboardFinanceDateRangeApiResponse,
  DashboardFinanceDateRangePayload,
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

export const getDashboardFinanceDateRangeApi = async (
  payload: DashboardFinanceDateRangePayload
): Promise<DashboardFinanceDateRangeApiResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/finance/date-range`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: payload,
  });
  return response.data;
};

export const getDashboardExpenseDateRangeApi = async (
  payload: DashboardExpenseDateRangePayload
): Promise<DashboardExpenseDateRangeApiResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/expense/date-range`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
