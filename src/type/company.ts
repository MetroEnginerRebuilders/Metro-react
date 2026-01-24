export interface Company {
  company_id: string;
  company_name: string;
  executive_name: string;
  executive_phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyFormData {
  companyName: string;
  executiveName: string;
  executivePhoneNumber: string;
}

export interface CompanyListState {
  list: Company[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

export interface CreateCompanyState {
  company_name: string;
  executive_name: string;
  executive_phone_number: string;
}

export interface EditCompanyState {
  company_name: string;
  executive_name: string;
  executive_phone_number: string;
}

export interface CompanyApiResponse<T> {
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

export interface GetCompanyListParams {
  page?: number;
  limit?: number;
  search?: string;
}
