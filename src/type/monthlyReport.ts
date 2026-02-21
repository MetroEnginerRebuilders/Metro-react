export interface MonthlyReportExpenseItem {
  expense_type: string;
  amount: string | number;
}

export interface MonthlyReportIncomeItem {
  income_type: string;
  amount: string | number;
}

export interface MonthlyReportDayItem {
  date: string;
  day: number;
  expenses: MonthlyReportExpenseItem[];
  total_expenses: number;
  salary: number | string | null;
  income: MonthlyReportIncomeItem[];
  total_income: number;
}

export interface MonthlyReportData {
  month: string;
  year: number;
  daily_reports: MonthlyReportDayItem[];
}

export interface MonthlyReportPayload {
  year: string;
  month: string;
}

export interface MonthlyReportPdfPayload {
  year: string;
  month: string;
}

export interface MonthlyReportResponse {
  success: boolean;
  message?: string;
  data?: MonthlyReportData;
}

export type MonthlyReportPdfResponse = Blob;
