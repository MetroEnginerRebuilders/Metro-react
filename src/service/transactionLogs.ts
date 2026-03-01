import axios from "axios";
import type { DailyTransactionApiResponse } from "../type/transactionLogs";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getDailyTransactionApi = async (
  date: string
): Promise<DailyTransactionApiResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/daily-transaction/${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
