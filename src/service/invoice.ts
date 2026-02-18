import axios from "axios";
import type { Invoice, InvoiceApiResponse, GetInvoiceListParams, InvoiceDetailResponse, InvoiceDetailsApiResponse, AddInvoiceItemsRequest, AddInvoiceItemsResponse } from "../type/invoice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getInvoiceListApi = async (
  params: GetInvoiceListParams
): Promise<InvoiceApiResponse<Invoice[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/invoice`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const getInvoiceDetailsApi = async (
  invoiceId: string
): Promise<{ success: boolean; data?: InvoiceDetailsApiResponse; message?: string }> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/invoice/${invoiceId}/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getInvoiceDetailApi = async (
  invoiceId: string
): Promise<InvoiceDetailResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/invoice/${invoiceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getInvoiceItemTypesApi = async (): Promise<any> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/item-type`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStockTransactionCompaniesApi = async (): Promise<any> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/stock-transaction/companies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStockTransactionModelsApi = async (companyId: string): Promise<any> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/stock-transaction/company/${companyId}/models`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStockTransactionSparesApi = async (modelId: string): Promise<any> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/stock-transaction/model/${modelId}/spares`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addInvoiceItemsApi = async (
  invoiceId: string,
  payload: AddInvoiceItemsRequest
): Promise<AddInvoiceItemsResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(
    `${BASE_URL}/invoice/${invoiceId}/items`,
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
