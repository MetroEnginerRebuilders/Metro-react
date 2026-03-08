import axios from "axios";
import type { CreateStockRequest, UpdateStockRequest, UpdateStockResponse, StockTransactionByIdResponse, StockPaymentPayload, StockPaymentResponse, StockPaymentDetailsResponse, Stock, ApiResponse, StockTransactionAvailabilityPayload, StockTransactionAvailabilityResponse } from "../type/stock";

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

export const updateStockApi = async (
  stockTransactionId: string,
  data: UpdateStockRequest
): Promise<UpdateStockResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/stock-transaction/${stockTransactionId}`, data, {
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

export const getPurchasedStockListApi = async (
  params: import("../type/stock").PurchasedStockListParams
): Promise<import("../type/stock").PurchasedStockListResponse> => {
  const token = sessionStorage.getItem("token");
  const queryParams: any = {
    page: params.page,
    limit: params.limit,
  };

  if (params.search) {
    queryParams.search = params.search;
  }

  const response = await axios.get(`${BASE_URL}/stock-transaction/purchase-list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: queryParams,
  });

  return response.data;
};

export const getStockTransactionDetailsApi = async (
  stockTransactionId: string
): Promise<import("../type/stock").StockTransactionDetailsResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/stock-transaction/details/${stockTransactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getStockTransactionByIdApi = async (
  stockTransactionId: string
): Promise<StockTransactionByIdResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/stock-transaction/${stockTransactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const makeStockPaymentApi = async (
  payload: StockPaymentPayload
): Promise<StockPaymentResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/stock-transaction/payment`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStockPaymentDetailsApi = async (
  stockTransactionId: string
): Promise<StockPaymentDetailsResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/stock-transaction/payment/${stockTransactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

export const getStockTransactionAvailabilityApi = async (
  payload: StockTransactionAvailabilityPayload
): Promise<StockTransactionAvailabilityResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/stock-transaction/availability`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
