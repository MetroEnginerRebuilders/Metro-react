export interface Spare {
  spare_id: number;
  spare_name: string;
}

export interface SpareFormData {
  spareName: string;
}

export interface SpareListState {
  list: Spare[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
}

export interface CreateSpareState {
  spare_name: string;
}

export interface EditSpareState {
  spare_name: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface GetSpareListParams {
  page?: number;
  limit?: number;
  search?: string;
}