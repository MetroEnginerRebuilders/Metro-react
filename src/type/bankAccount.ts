export interface BankAccount {
  bank_account_id: string;
  account_name: string;
  account_number: string;
  opening_balance: string;
  activate_date: string;
  inactivate_date: string | null;
  last_transaction: string | null;
  current_balance: string;
  created_at: string;
  updated_at: string;
}

export interface BankAccountFormData {
  accountName: string;
  accountNumber: string;
  openingBalance: string;
  activateDate: string;
  inactivateDate?: string;
}

export interface BankAccountListState {
  list: BankAccount[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

export interface CreateBankAccountState {
  account_name: string;
  account_number: string;
  opening_balance: string;
  activate_date: string;
}

export interface EditBankAccountState {
  account_name: string;
  account_number: string;
  opening_balance: string;
  activate_date: string;
  inactivate_date: string;
}

export interface BankAccountApiResponse<T> {
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

export interface GetBankAccountListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AccountTransferFormData {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  transferDate: string;
}

export interface AccountTransferState {
  from_account_id: string;
  to_account_id: string;
  amount: string;
  transfer_date: string;
}

export interface AccountTransferApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
