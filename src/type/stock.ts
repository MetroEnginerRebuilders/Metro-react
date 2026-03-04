export interface StockItem {
  companyId: string;
  modelId: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CreateStockRequest {
  shopId: string;
  transactionTypeId: string;
  bankAccountId: string;
  orderDate: string;
  description: string;
  items: StockItem[];
  totalAmount: number;
}

export interface Stock {
  stock_id: string;
  shop_id: string;
  transaction_type_id: string;
  bank_account_id: string;
  order_date: string;
  description: string;
  total_amount: number;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface StockTransactionCompany {
  company_id: string;
  company_name: string;
}

export interface StockTransactionCompaniesResponse {
  success: boolean;
  message: string;
  data: StockTransactionCompany[];
}

export interface StockTransactionModel {
  model_id: string;
  model_name: string;
}

export interface StockTransactionModelsResponse {
  success: boolean;
  message: string;
  data: StockTransactionModel[];
}

export interface StockTransactionSpare {
  spare_id: string;
  spare_name: string;
}

export interface StockTransactionSparesResponse {
  success: boolean;
  message: string;
  data: StockTransactionSpare[];
}

export interface StockTransactionItem {
  stock_transaction_item_id: string;
  company_name: string;
  model_name: string;
  spare_name: string;
  quantity: number;
  price: number;
  total_price: number;
  shop_name: string;
  order_date: string;
}

export interface CurrentStockItem {
  company_name: string;
  model_name: string;
  spare_name: string;
  current_quantity: number;
  average_price: number;
}

export interface StockListParams {
  stockTypeCode?: string;
  page: number;
  limit: number;
  search?: string;
}

export interface StockListResponse {
  success: boolean;
  message: string;
  data: StockTransactionItem[] | CurrentStockItem[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface DeleteStockResponse {
  success: boolean;
  message: string;
}

export interface StockTransactionAvailabilityPayload {
  companyId: string;
  modelId: string;
  spareId: string;
}

export interface StockTransactionAvailabilityData {
  availableQuantity: number;
  boughtPrice: number;
}

export interface StockTransactionAvailabilityResponse {
  success: boolean;
  message: string;
  data: StockTransactionAvailabilityData;
}
