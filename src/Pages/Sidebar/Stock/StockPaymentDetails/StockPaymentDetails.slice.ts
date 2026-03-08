import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StockPaymentDetailsData } from "../../../../type/stock";

interface StockPaymentDetailsState {
  data: StockPaymentDetailsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: StockPaymentDetailsState = {
  data: null,
  loading: false,
  error: null,
};

const stockPaymentDetailsSlice = createSlice({
  name: "stockPaymentDetails",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPaymentDetails: (state, action: PayloadAction<StockPaymentDetailsData>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearPaymentDetails: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setPaymentDetails, setError, clearPaymentDetails } = stockPaymentDetailsSlice.actions;
export default stockPaymentDetailsSlice.reducer;