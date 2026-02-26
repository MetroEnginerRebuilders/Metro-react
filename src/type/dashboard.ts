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
