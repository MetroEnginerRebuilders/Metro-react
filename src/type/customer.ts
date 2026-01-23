export interface Customer {
  customer_id: string;
  customer_number?: string;
  customer_name: string;
  customer_address1: string;
  customer_address2: string;
  customer_phone_number: string;
  customer_type_id: number;
  customer_type_name?: string;
}

export interface CustomerFormData {
  customerName: string;
  customerAddress1: string;
  customerAddress2: string;
  customerPhoneNumber: string;
  customerTypeId: number;
}

export interface CustomerListState {
  list: Customer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
}

export interface CreateCustomerState {
  customer_name: string;
  customer_address1: string;
  customer_address2: string;
  customer_phone_number: string;
  customer_type_id: number | null;
}

export interface EditCustomerState {
  customer_name: string;
  customer_address1: string;
  customer_address2: string;
  customer_phone_number: string;
  customer_type_id: number | null;
}

export interface CustomerApiResponse<T> {
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

export interface GetCustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
}
