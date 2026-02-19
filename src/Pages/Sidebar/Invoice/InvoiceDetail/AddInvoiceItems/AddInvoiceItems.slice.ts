import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InvoiceItemType, CompanyData } from "../../../../../type/invoice";

interface AddInvoiceItemsState {
  itemTypes: InvoiceItemType[];
  companies: CompanyData[];
  loading: boolean;
  error: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: AddInvoiceItemsState = {
  itemTypes: [],
  companies: [],
  loading: false,
  error: null,
  deleteLoading: false,
  deleteError: null,
};

const addInvoiceItemsSlice = createSlice({
  name: "addInvoiceItems",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setItemTypes: (state, action: PayloadAction<InvoiceItemType[]>) => {
      state.itemTypes = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCompanies: (state, action: PayloadAction<CompanyData[]>) => {
      state.companies = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setDeleteLoading: (state, action: PayloadAction<boolean>) => {
      state.deleteLoading = action.payload;
    },
    setDeleteError: (state, action: PayloadAction<string>) => {
      state.deleteError = action.payload;
      state.deleteLoading = false;
    },
    clearDeleteInvoiceItem: (state) => {
      state.deleteLoading = false;
      state.deleteError = null;
    },
    clearAddInvoiceItems: (state) => {
      state.itemTypes = [];
      state.companies = [];
      state.loading = false;
      state.error = null;
      state.deleteLoading = false;
      state.deleteError = null;
    },
  },
});

export const {
  setLoading,
  setItemTypes,
  setCompanies,
  setError,
  setDeleteLoading,
  setDeleteError,
  clearDeleteInvoiceItem,
  clearAddInvoiceItems,
} = addInvoiceItemsSlice.actions;

export default addInvoiceItemsSlice.reducer;
