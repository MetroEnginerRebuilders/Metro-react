import type { StockTypeListResponse } from "../type/stockType";
import { commonApi } from "./commonStructure";

export const getStockTypeListApi = async (): Promise<StockTypeListResponse> => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await commonApi<StockTypeListResponse>(
      "get",
      "/stock-transaction-types",
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
