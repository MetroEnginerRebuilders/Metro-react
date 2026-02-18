export interface Job {
  job_id: string;
  job_code?: string;
  job_number?: string;
  customer_name: string;
  start_date: string;
  description: string;
  received_items: string;
  amount_payable: string | number;
  advance_amount: string | number;
  created_at?: string;
  updated_at?: string;
}

export interface JobListState {
  list: Job[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

export interface JobApiResponse<T> {
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

export interface GetJobListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateJobState {
  customer_id: string;
  description: string;
  start_date: string;
  received_items: string;
  advance_amount: string;
  bank_account_id: string;
}

export interface CreateJobRequest {
  customerId: string;
  description: string;
  startDate: string;
  receivedItems: string;
  advanceAmount: string;
  bankAccountId: string;
}

export interface CreateJobResponse {
  success: boolean;
  message?: string;
  data?: Job;
}
