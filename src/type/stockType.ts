export interface StockType {
  stock_type_id: string;
  stock_type_name: string;
  stock_type_code: string;
  created_at: string;
}

export interface StockTypeListResponse {
  success: boolean;
  message: string;
  data: StockType[];
}
