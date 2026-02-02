export interface IncomeCategory {
  finance_category_id: string;
  finance_category_name: string;
  finance_type_id: string;
  finance_type_name: string;
  finance_type_code: string;
  created_at: string;
  updated_at: string;
}

export interface IncomeCategoryListResponse {
  success: boolean;
  data: IncomeCategory[];
}
