export type StatementType = "customer" | "shop";

export interface StatementFilterPayload {
  type: StatementType;
  customerId?: string;
  shopId?: string;
}

export interface StatementRecord {
  statement_id: string;
  date: string;
  type: StatementType;
  stock_type?: string;
  description: string;
  item: string;
  account_payable: number;
  account_transaction_amount: number;
}

export interface ShopStatementApiItem {
  transaction_id: string;
  reference_id: string;
  transaction_date: string;
  transaction_type: string;
  entry_type: "expense" | "income";
  payment_type: string | null;
  amount: number;
  quantity: number;
  unit_price: number;
  description: string;
  company_name: string;
  model_name: string;
  spare_name: string;
  shop_name: string;
  stock_type: string;
}

export interface CustomerStatementApiItem {
  transaction_id: string;
  reference_id: string;
  transaction_date: string;
  transaction_type: string;
  entry_type: "income" | "expense";
  amount: number;
  description: string;
  received_items: string;
}

export interface StatementApiResponse {
  success: boolean;
  message?: string;
  data?: Array<StatementRecord | ShopStatementApiItem | CustomerStatementApiItem>;
}
