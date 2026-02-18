import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InvoiceDetail, InvoiceItem, InvoiceDetailsApiResponse } from "../../../../type/invoice";

interface InvoiceDetailState {
  detail: InvoiceDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: InvoiceDetailState = {
  detail: null,
  loading: false,
  error: null,
};

const invoiceDetailSlice = createSlice({
  name: "invoiceDetail",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInvoiceDetails: (state, action: PayloadAction<InvoiceDetailsApiResponse>) => {
      const { invoice, job, customer, items } = action.payload;
      state.detail = {
        invoice_id: invoice.invoice_id,
        invoice_number: invoice.invoice_number,
        customer_name: customer.customer_name,
        job_number: job.job_number,
        invoice_date: invoice.invoice_date,
        total_amount: invoice.total_amount,
        amount_paid: "0",
        invoice_status: invoice.invoice_status,
        created_at: invoice.created_at,
        updated_at: invoice.updated_at,
        customer,
        job,
        items: items || [],
      };
      state.error = null;
      state.loading = false;
    },
    setInvoiceDetail: (state, action: PayloadAction<InvoiceDetail>) => {
      state.detail = action.payload;
      state.error = null;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addInvoiceItems: (state, action: PayloadAction<InvoiceItem[]>) => {
      if (state.detail) {
        state.detail.items = [...(state.detail.items || []), ...action.payload];
      }
    },
    deleteInvoiceItem: (state, action: PayloadAction<string>) => {
      if (state.detail && state.detail.items) {
        state.detail.items = state.detail.items.filter(
          (item) => item.invoice_item_id !== action.payload
        );
      }
    },
    updateInvoiceItem: (
      state,
      action: PayloadAction<{ itemId: string; updatedData: Partial<InvoiceItem> }>
    ) => {
      if (state.detail && state.detail.items) {
        const itemIndex = state.detail.items.findIndex(
          (item) => item.invoice_item_id === action.payload.itemId
        );
        if (itemIndex !== -1) {
          state.detail.items[itemIndex] = {
            ...state.detail.items[itemIndex],
            ...action.payload.updatedData,
          };
        }
      }
    },
    clearInvoiceDetail: (state) => {
      state.detail = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setInvoiceDetails,
  setInvoiceDetail,
  setError,
  addInvoiceItems,
  deleteInvoiceItem,
  updateInvoiceItem,
  clearInvoiceDetail,
} = invoiceDetailSlice.actions;

export default invoiceDetailSlice.reducer;
