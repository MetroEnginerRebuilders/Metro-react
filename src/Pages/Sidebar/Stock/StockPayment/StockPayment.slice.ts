import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BankAccount } from "../../../../type/bankAccount";

interface StockPaymentState {
  open: boolean;
  bankAccounts: BankAccount[];
  loadingBankAccounts: boolean;
  paymentLoading: boolean;
  selectedBankAccountId: string;
  paymentDate: string;
  paymentAmount: string;
  remarks: string;
  error: string | null;
}

const initialState: StockPaymentState = {
  open: false,
  bankAccounts: [],
  loadingBankAccounts: false,
  paymentLoading: false,
  selectedBankAccountId: "",
  paymentDate: "",
  paymentAmount: "",
  remarks: "",
  error: null,
};

const stockPaymentSlice = createSlice({
  name: "stockPayment",
  initialState,
  reducers: {
    openStockPaymentModal: (
      state,
      action: PayloadAction<{ paymentDate: string; paymentAmount: string }>
    ) => {
      state.open = true;
      state.paymentDate = action.payload.paymentDate;
      state.paymentAmount = action.payload.paymentAmount;
      state.selectedBankAccountId = "";
      state.remarks = "";
      state.error = null;
    },
    closeStockPaymentModal: (state) => {
      state.open = false;
      state.paymentLoading = false;
      state.error = null;
    },
    setBankAccounts: (state, action: PayloadAction<BankAccount[]>) => {
      state.bankAccounts = action.payload;
    },
    setLoadingBankAccounts: (state, action: PayloadAction<boolean>) => {
      state.loadingBankAccounts = action.payload;
    },
    setPaymentLoading: (state, action: PayloadAction<boolean>) => {
      state.paymentLoading = action.payload;
    },
    setPaymentField: (
      state,
      action: PayloadAction<{
        field: "selectedBankAccountId" | "paymentDate" | "paymentAmount" | "remarks";
        value: string;
      }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setPaymentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetStockPaymentState: () => initialState,
  },
});

export const {
  openStockPaymentModal,
  closeStockPaymentModal,
  setBankAccounts,
  setLoadingBankAccounts,
  setPaymentLoading,
  setPaymentField,
  setPaymentError,
  resetStockPaymentState,
} = stockPaymentSlice.actions;

export default stockPaymentSlice.reducer;