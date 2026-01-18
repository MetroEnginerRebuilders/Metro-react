import type { GetShopParams, ShopListResponse,  DeleteShopResponse, ShopRequest, ShopResponse } from "../type/shops";
import { commonApi } from "./commonStructure";

export const getShopListApi = async (
  params?: GetShopParams
): Promise<ShopListResponse> => {
  const response = await commonApi<ShopListResponse>(
    "GET",
    "/shop",
    null,
    params ? {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    } : undefined
  );

  return response.data;
};

export const createShopApi = async (
  body: ShopRequest
): Promise<ShopResponse> => {
  const response = await commonApi<ShopResponse>(
    "POST",
    "/shop",
    body
  );

  return response.data;
};

export const updateShopApi = async (
  shopId: string,
  body: ShopRequest
): Promise<ShopResponse> => {
  const response = await commonApi<ShopResponse>(
    "PUT",
    `/shop/${shopId}`,
    body
  );

  return response.data;
};

export const deleteShopApi = async (
  shopId: string
): Promise<DeleteShopResponse> => {
  const response = await commonApi<DeleteShopResponse>(
    "DELETE",
    `/shop/${shopId}`,
    null
  );

  return response.data;
};