export interface CustomerType {
  customer_type_id: string;
  customer_type_name: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerTypeListResponse {
  success: boolean;
  data: CustomerType[];
}
