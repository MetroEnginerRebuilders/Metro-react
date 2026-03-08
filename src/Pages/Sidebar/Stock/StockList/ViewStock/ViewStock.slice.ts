import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StockTransactionDetailsData } from "../../../../../type/stock";

interface ViewStockState {
  loading: boolean;
  details: StockTransactionDetailsData | null;
  error: string | null;
}

const initialState: ViewStockState = {
  loading: false,
  details: null,
  error: null,
};

const viewStockSlice = createSlice({
  name: "viewStock",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDetails: (state, action: PayloadAction<StockTransactionDetailsData | null>) => {
      state.details = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetViewStock: () => initialState,
  },
});

export const { setLoading, setDetails, setError, resetViewStock } = viewStockSlice.actions;
export default viewStockSlice.reducer;