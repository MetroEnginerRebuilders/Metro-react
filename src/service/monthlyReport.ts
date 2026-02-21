import axios from "axios";
import type {
  MonthlyReportPayload,
  MonthlyReportPdfPayload,
  MonthlyReportPdfResponse,
  MonthlyReportResponse,
} from "../type/monthlyReport";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getMonthlyReportApi = async (
  payload: MonthlyReportPayload
): Promise<MonthlyReportResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(
    `${BASE_URL}/finance/report/monthly`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const downloadMonthlyReportPdfApi = async (
  payload: MonthlyReportPdfPayload
): Promise<MonthlyReportPdfResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(
    `${BASE_URL}/finance/report/monthly/download-pdf`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "blob",
    }
  );
  return response.data;
};
