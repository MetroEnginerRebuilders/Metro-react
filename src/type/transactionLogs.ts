export interface DailyTransactionItem {
  transaction_id: string;
  reference_id: string;
  finance_types_id?: string;
  financeTypeName?: string;
  transaction_date: string;
  amount: number;
  description: string;
}

export interface DailyTransactionApiResponse {
  success: boolean;
  message?: string;
  data?: DailyTransactionItem[];
}

export interface TransactionLogsState {
  list: DailyTransactionItem[];
}
