export interface StaffSalary {
  staff_salary_id: string;
  staff_id: string;
  bank_account_id: string;
  effective_date: string;
  amount: string;
  salary_type_id: string;
  remarks: string;
  created_at: string;
  updated_at: string;
  staff_name: string;
  account_name: string;
  salary_type: string;
}

export interface StaffSalaryMonthSummary {
  payment_count?: number;
  total_amount?: number | string;
  total_paid?: number | string;
  balance_amount?: number | string;
  balance_salary?: number | string;
}

export interface StaffSalaryFormData {
  staffId: string;
  bankAccountId: string;
  effectiveDate: string;
  amount: number;
  salaryTypeId: string;
  remarks: string;
}

export interface StaffSalaryListState {
  list: StaffSalary[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

export interface CreateStaffSalaryState {
  staff_id: string;
  bank_account_id: string;
  effective_date: string;
  amount: string;
  salary_type_id: string;
  remarks: string;
}

export interface EditStaffSalaryState {
  staff_id: string;
  bank_account_id: string;
  effective_date: string;
  amount: string;
  salary_type_id: string;
  remarks: string;
}

export interface StaffSalaryApiResponse<T> {
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

export interface GetStaffSalaryListParams {
  page?: number;
  limit?: number;
  search?: string;
}
