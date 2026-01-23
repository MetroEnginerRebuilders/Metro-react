import axios from "axios";
import type { CustomerTypeListResponse } from "../type/customerType";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCustomerTypeListApi = async (): Promise<CustomerTypeListResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/customer-types`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
