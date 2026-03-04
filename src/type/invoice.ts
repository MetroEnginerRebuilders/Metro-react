export interface Invoice {
  invoice_id: string;
  invoice_number?: string;
  customer_name: string;
  job_number?: string;
  invoice_date: string;
  description?: string;
  total_amount: string | number;
  amount_paid: string | number;
  balance_amount?: string | number;
  invoice_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceListState {
  list: Invoice[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

export interface InvoiceApiResponse<T> {
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

export interface GetInvoiceListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface InvoiceItem {
  invoice_item_id: string;
  invoice_id?: string;
  item_type_id: string;
  item_type_name?: string;
  item_type_code?: string;
  work_id?: string | null;
  work_name?: string | null;
  type_of_work?: string | null;
  spare_id?: string | null;
  remarks?: string | null;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
  company_id?: string | null;
  model_id?: string | null;
  company_name?: string;
  model_name?: string;
  spare_name?: string;
  bank_account_id?: string | null;
  account_name?: string;
  account_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceCustomerDetails {
  customer_id: string;
  customer_number?: string;
  customer_name: string;
  customer_phone_number?: string;
  customer_address1?: string;
  customer_address2?: string;
  customer_type_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceJobDetails {
  job_id: string;
  job_number?: string;
  customer_id?: string;
  description?: string;
  advance_amount?: string;
  bank_account_id?: string;
  received_items?: string;
  start_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceDetailData {
  invoice_id: string;
  invoice_number?: string;
  job_id?: string;
  customer_id?: string;
  invoice_date: string;
  total_amount: string;
  amount_paid?: string | number;
  balance_amount?: string | number;
  invoice_status?: string;
  payment_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceDetailsApiResponse {
  invoice: InvoiceDetailData;
  job: InvoiceJobDetails;
  customer: InvoiceCustomerDetails;
  items?: InvoiceItem[];
}

export interface InvoiceDetail extends Invoice {
  customer?: InvoiceCustomerDetails;
  job?: InvoiceJobDetails;
  items?: InvoiceItem[];
  payment_status?: string;
}

export interface InvoiceDetailResponse {
  success: boolean;
  message?: string;
  data?: InvoiceDetail;
}

export interface InvoiceItemType {
  item_type_id: string;
  item_type_name: string;
  item_type_code?: string;
}

export interface CompanyData {
  company_id: string;
  company_name: string;
}

export interface ModelData {
  model_id: string;
  model_name: string;
}

export interface SpareData {
  spare_id: string;
  spare_name: string;
}

export interface InvoiceAddItem {
  tempId: string;
  item_type_id: string;
  type_of_work: string;
  work_id: string;
  company_id: string;
  model_id: string;
  spare_id: string;
  remarks: string;
  quantity: string;
  unit_price: string;
  bank_account_id: string;
}

export interface AddInvoiceItemPayload {
  item_type_id: string;
  type_of_work?: string;
  work_id?: string;
  company_id?: string;
  model_id?: string;
  spare_id?: string;
  remarks?: string;
  quantity: number;
  unit_price: number;
  bank_account_id?: string;
}

export interface AddInvoiceItemsRequest {
  items: AddInvoiceItemPayload[];
}

export interface AddInvoiceItemsResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface DeleteInvoiceItemResponse {
  success: boolean;
  message?: string;
  data?: any;
}
export interface BankAccount {
  bank_account_id: string;
  account_name?: string;
  account_number?: string;
  account_holder_name?: string;
  bank_name?: string;
  branch_name?: string;
  ifsc_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MakePaymentPayload {
  invoice_id: string;
  bank_account_id: string;
  payment_date: string;
  amount_paid: number;
  status: boolean;
  remarks?: string;
}

export interface MakePaymentRequest {
  invoice_id: string;
  bank_account_id: string;
  payment_date: string;
  amount_paid: number;
  status: boolean;
  remarks?: string;
}

export interface MakePaymentResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface InvoicePayment {
  invoice_payment_id: string;
  invoice_id: string;
  bank_account_id: string;
  amount_paid: string | number;
  remarks?: string;
  payment_date: string;
  status: string | boolean;
  created_at: string;
  updated_at: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
}

export interface PaymentsSummary {
  payment_count: number;
  total_amount: number | string;
  total_paid: number | string;
  balance_amount: number | string;
}

export interface PaymentDetailsData {
  invoice_id: string;
  summary: PaymentsSummary;
  payments: InvoicePayment[];
}

export interface PaymentDetailsResponse {
  success: boolean;
  message?: string;
  data?: PaymentDetailsData;
}