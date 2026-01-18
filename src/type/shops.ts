export interface Shop {
  shop_id: string;
  shop_name: string;
  shop_address: string;
  shop_phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ShopListResponse {
  success: boolean;
  data: Shop[];
  pagination: Pagination;
}

export interface GetShopParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ShopRequest {
  shopName: string;
  shopAddress: string;
  shopPhoneNumber: string;
}

export interface ShopResponse {
  success: boolean;
  message: string;
  data?: Shop;
}

export interface DeleteShopResponse {
  success: boolean;
  message: string;
}