export interface Work {
  work_id: string;
  work_name: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface WorkListResponse {
  success: boolean;
  data: Work[];
  pagination: Pagination;
}

export interface GetWorkParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateWorkRequest {
  workName: string;
}

export interface CreateWorkResponse {
  success: boolean;
  message: string;
  data?: Work;
}

export interface UpdateWorkRequest {
  workName: string;
}

export interface UpdateWorkResponse {
  success: boolean;
  message: string;
  data?: Work;
}

export interface DeleteWorkResponse {
  success: boolean;
  message: string;
}
