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

export interface UpdateStockRequest {
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

export interface PurchasedStockListItem {
  stock_transaction_id: string;
  shop_name: string;
  no_of_items: number;
  total_price: number;
  purchase_date: string;
  payment_status: string;
}

export interface PurchasedStockListParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PurchasedStockListResponse {
  success: boolean;
  message: string;
  data: PurchasedStockListItem[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
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

export interface StockTransactionDetails {
  stock_transaction_id: string;
  shop_id: string;
  shop_name: string;
  stock_type_id: string;
  stock_type_name: string;
  stock_type_code: string;
  bank_account_id: string;
  account_name: string;
  account_number: string;
  order_date: string;
  description: string;
  total_amount: number;
  amount_paid?: number | string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface StockTransactionDetailsItem {
  stock_transaction_item_id: string;
  company_id: string;
  company_name: string;
  model_id: string;
  model_name: string;
  spare_id: string;
  spare_name: string;
  quantity: number;
  price: number;
  line_total: number;
}

export interface StockTransactionDetailsData {
  transaction: StockTransactionDetails;
  items: StockTransactionDetailsItem[];
}

export interface StockTransactionDetailsResponse {
  success: boolean;
  message: string;
  data: StockTransactionDetailsData;
}

export interface StockTransactionByIdData {
  stock_transaction_id: string;
  shop_id: string;
  shop_name: string;
  stock_type_id: string;
  stock_type_name: string;
  stock_type_code: string;
  order_date: string;
  description: string;
  bank_account_id: string;
  account_name: string;
  account_number: string;
  total_amount: string | number;
  amount_paid?: number | string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  items: StockTransactionDetailsItem[];
}

export interface StockTransactionByIdResponse {
  success: boolean;
  message: string;
  data: StockTransactionByIdData;
}

export type UpdateStockResponse = StockTransactionByIdResponse;

export interface StockPaymentPayload {
  stockTransactionId: string;
  bankAccountId: string;
  amountPaid: number;
  paymentDate: string;
  remarks?: string;
}

export interface StockPaymentData {
  stock_payment_id: string;
  stock_transaction_id: string;
  stock_type_id: string;
  bank_account_id: string;
  amount_paid: number;
  payment_status: string;
  payment_on: string;
  remarks: string | null;
  total_paid: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface StockPaymentResponse {
  success: boolean;
  message: string;
  data: StockPaymentData;
}

export interface StockPaymentDetailsSummary {
  payment_count: number;
  total_amount: number;
  total_paid: number;
  balance_amount: number;
}

export interface StockPaymentDetailsItem {
  stock_payment_id: string;
  stock_transaction_id: string;
  stock_type_id: string;
  bank_account_id: string;
  amount_paid: string | number;
  payment_status: string;
  payment_on: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  account_name: string | null;
  account_number: string | null;
}

export interface StockPaymentDetailsData {
  stock_transaction_id: string;
  summary: StockPaymentDetailsSummary;
  payments: StockPaymentDetailsItem[];
}

export interface StockPaymentDetailsResponse {
  success: boolean;
  message: string;
  data: StockPaymentDetailsData;
}
