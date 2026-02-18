import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InvoiceItemType, CompanyData } from "../../../../type/invoice";

interface AddInvoiceItemsState {
  itemTypes: InvoiceItemType[];
  companies: CompanyData[];
  loading: boolean;
  error: string | null;
}

const initialState: AddInvoiceItemsState = {
  itemTypes: [],
  companies: [],
  loading: false,
  error: null,
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
    clearAddInvoiceItems: (state) => {
      state.itemTypes = [];
      state.companies = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setItemTypes,
  setCompanies,
  setError,
  clearAddInvoiceItems,
} = addInvoiceItemsSlice.actions;

export default addInvoiceItemsSlice.reducer;
