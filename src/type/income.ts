export interface Income {
  finance_id: string;
  transaction_date: string;
  amount: string;
  description: string;
  bank_account_id: string;
  account_name?: string;
  remarks: string | null;
  finance_category_id: string;
  finance_category_name?: string;
  finance_type_id: string;
  finance_type_name?: string;
  created_at: string;
}

export interface IncomeFormData {
  transactionDate: string;
  amount: string;
  description: string;
  bankAccountId: string;
  remarks: string;
  financeCategoryId: string;
  financeTypeCode: string;
}

export interface IncomeListState {
  list: Income[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

export interface CreateIncomeState {
  transaction_date: string;
  amount: string;
  description: string;
  bank_account_id: string;
  remarks: string;
  finance_category_id: string;
}

export interface EditIncomeState {
  transaction_date: string;
  amount: string;
  description: string;
  bank_account_id: string;
  remarks: string;
  finance_category_id: string;
}

export interface IncomeApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetIncomeListParams {
  page?: number;
  limit?: number;
  search?: string;
  financeTypeCode?: string;
}
