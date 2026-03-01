import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DailyTransactionItem, TransactionLogsState } from "../../../type/transactionLogs";

const initialState: TransactionLogsState = {
  list: [],
};

const transactionLogsSlice = createSlice({
  name: "transactionLogs",
  initialState,
  reducers: {
    setTransactionLogs: (state, action: PayloadAction<DailyTransactionItem[]>) => {
      state.list = action.payload;
    },
    clearTransactionLogs: (state) => {
      state.list = [];
    },
  },
});

export const { setTransactionLogs, clearTransactionLogs } = transactionLogsSlice.actions;
export default transactionLogsSlice.reducer;
