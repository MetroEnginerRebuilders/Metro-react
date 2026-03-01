export interface DashboardIncomeExpensePayload {
  fromDate: string;
  toDate: string;
}

export interface DashboardIncomeExpenseSummary {
  from_date: string;
  to_date: string;
  total_income: number;
  total_expense: number;
  net_amount: number;
}

export interface DashboardIncomeExpenseApiResponse {
  success: boolean;
  message?: string;
  data?: DashboardIncomeExpenseSummary;
}

export interface DashboardYearlyIncomeExpensePayload {
  year: number;
}

export interface DashboardYearlyMonthlyDataItem {
  month: number;
  month_label: string;
  total_income: number;
  total_expense: number;
  net_amount: number;
}

export interface DashboardYearlyIncomeExpenseData {
  year: number;
  monthly_data: DashboardYearlyMonthlyDataItem[];
}

export interface DashboardYearlyIncomeExpenseApiResponse {
  success: boolean;
  message?: string;
  data?: DashboardYearlyIncomeExpenseData;
}

export interface DashboardFinanceDateRangePayload {
  fromDate: string;
  toDate: string;
}

export interface DashboardFinanceDateRangeItem {
  transaction_id: string;
  shop_id: string | null;
  finance_types_id: string | null;
  finance_categories_id: string | null;
  reference_type:
    | "finance"
    | "customer"
    | "invoice_payment"
    | "job"
    | "salary"
    | "stock"
    | null;
  reference_id: string | null;
  bank_account_id: string | null;
  amount: number;
  transaction_date: string;
  description: string | null;
  created_at: string;
  finance_type_code: string;
  finance_type_name: string;
  finance_category_name: string | null;
  account_name: string | null;
  reference_name: string | null;
}

export interface DashboardFinanceDateRangeApiResponse {
  success: boolean;
  message?: string;
  data?: DashboardFinanceDateRangeItem[];
}

export interface DashboardExpenseDateRangePayload {
  fromDate: string;
  toDate: string;
}

export interface DashboardExpenseDateRangeItem {
  transaction_id: string;
  shop_id: string | null;
  finance_types_id: string | null;
  finance_categories_id: string | null;
  reference_type: string | null;
  reference_id: string | null;
  bank_account_id: string | null;
  amount: number;
  transaction_date: string;
  description: string | null;
  created_at: string;
  finance_type_code: string;
  finance_type_name: string;
  finance_category_name: string | null;
  account_name: string | null;
  reference_name: string | null;
}

export interface DashboardExpenseDateRangeApiResponse {
  success: boolean;
  message?: string;
  data?: DashboardExpenseDateRangeItem[];
}
