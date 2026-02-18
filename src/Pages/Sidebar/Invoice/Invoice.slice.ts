import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Invoice, InvoiceListState } from "../../../type/invoice";

const initialState: InvoiceListState = {
  list: [],
  pagination: null,
};

const invoiceListSlice = createSlice({
  name: "invoiceList",
  initialState,
  reducers: {
    setInvoiceList: (
      state,
      action: PayloadAction<{
        data: Invoice[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }>
    ) => {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (invoice) => invoice.invoice_id !== action.payload
      );
    },
  },
});

export const { setInvoiceList, deleteInvoice } = invoiceListSlice.actions;
export default invoiceListSlice.reducer;
