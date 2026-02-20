import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaymentDetailsData } from "../../../../../type/invoice";

interface PaymentDetailsState {
  data: PaymentDetailsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentDetailsState = {
  data: null,
  loading: false,
  error: null,
};

const paymentDetailsSlice = createSlice({
  name: "paymentDetails",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPaymentDetails: (state, action: PayloadAction<PaymentDetailsData>) => {
      state.data = action.payload;
      state.error = null;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearPaymentDetails: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setPaymentDetails,
  setError,
  clearPaymentDetails,
} = paymentDetailsSlice.actions;

export default paymentDetailsSlice.reducer;
