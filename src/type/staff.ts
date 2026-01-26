export interface Staff {
  staff_id: string;
  staff_name: string;
  salary: string;
  active_date: string;
  inactive_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface StaffFormData {
  staffName: string;
  salary: number;
  activeDate: string;
}

export interface StaffEditFormData {
  staffName: string;
  salary: number;
  activeDate: string;
  inactiveDate?: string;
}

export interface StaffListState {
  list: Staff[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

export interface CreateStaffState {
  staff_name: string;
  salary: string;
  active_date: string;
}

export interface EditStaffState {
  staff_name: string;
  salary: string;
  active_date: string;
  inactive_date: string;
}

export interface StaffApiResponse<T> {
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

export interface GetStaffListParams {
  page?: number;
  limit?: number;
  search?: string;
}
