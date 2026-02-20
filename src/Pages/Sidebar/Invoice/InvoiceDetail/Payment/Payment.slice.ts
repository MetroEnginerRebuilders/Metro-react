import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BankAccount } from "../../../../../type/invoice";

interface PaymentState {
  bankAccounts: BankAccount[];
  loading: boolean;
  error: string | null;
  paymentLoading: boolean;
  paymentError: string | null;
}

const initialState: PaymentState = {
  bankAccounts: [],
  loading: false,
  error: null,
  paymentLoading: false,
  paymentError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBankAccounts: (state, action: PayloadAction<BankAccount[]>) => {
      state.bankAccounts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPaymentLoading: (state, action: PayloadAction<boolean>) => {
      state.paymentLoading = action.payload;
    },
    setPaymentError: (state, action: PayloadAction<string>) => {
      state.paymentError = action.payload;
      state.paymentLoading = false;
    },
    clearPaymentError: (state) => {
      state.paymentError = null;
      state.paymentLoading = false;
    },
    clearPayment: (state) => {
      state.bankAccounts = [];
      state.loading = false;
      state.error = null;
      state.paymentLoading = false;
      state.paymentError = null;
    },
  },
});

export const {
  setLoading,
  setBankAccounts,
  setError,
  setPaymentLoading,
  setPaymentError,
  clearPaymentError,
  clearPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
