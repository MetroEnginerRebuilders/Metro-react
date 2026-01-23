export interface Model {
  model_id: string;
  model_name: string;
  created_at: string;
  updated_at: string;
}

export interface ModelFormData {
  modelName: string;
}

export interface ModelListState {
  list: Model[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

export interface CreateModelState {
  model_name: string;
}

export interface EditModelState {
  model_name: string;
}

export interface ModelApiResponse<T> {
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

export interface GetModelListParams {
  page?: number;
  limit?: number;
  search?: string;
}
