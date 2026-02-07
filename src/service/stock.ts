import axios from "axios";
import type { CreateStockRequest, Stock, ApiResponse } from "../type/stock";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createStockApi = async (data: CreateStockRequest): Promise<ApiResponse<Stock>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/stock-transaction`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStockTransactionCompaniesApi = async (): Promise<import("../type/stock").StockTransactionCompaniesResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/stock-transaction/companies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStockTransactionModelsApi = async (companyId: string): Promise<import("../type/stock").StockTransactionModelsResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/stock-transaction/company/${companyId}/models`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStockTransactionSparesApi = async (modelId: string): Promise<import("../type/stock").StockTransactionSparesResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/stock-transaction/model/${modelId}/spares`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStockListApi = async (params: import("../type/stock").StockListParams): Promise<import("../type/stock").StockListResponse> => {
  const token = sessionStorage.getItem("token");
  const queryParams: any = {
    page: params.page,
    limit: params.limit,
  };
  
  if (params.search) {
    queryParams.search = params.search;
  }
  
  if (params.stockTypeCode) {
    queryParams.stockTypeCode = params.stockTypeCode;
  }
  
  const response = await axios.get(`${BASE_URL}/stock-transaction/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: queryParams,
  });
  return response.data;
};

export const deleteStockItemApi = async (stockTransactionItemId: string): Promise<import("../type/stock").DeleteStockResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/stock-transaction-item/${stockTransactionItemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
