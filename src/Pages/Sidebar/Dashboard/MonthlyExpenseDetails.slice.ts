import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardExpenseDateRangeItem } from "../../../type/dashboard";

interface MonthlyExpenseDetailsState {
  list: DashboardExpenseDateRangeItem[];
}

const initialState: MonthlyExpenseDetailsState = {
  list: [],
};

const monthlyExpenseDetailsSlice = createSlice({
  name: "monthlyExpenseDetails",
  initialState,
  reducers: {
    setMonthlyExpenseDetails: (state, action: PayloadAction<DashboardExpenseDateRangeItem[]>) => {
      state.list = action.payload;
    },
    clearMonthlyExpenseDetails: (state) => {
      state.list = [];
    },
  },
});

export const { setMonthlyExpenseDetails, clearMonthlyExpenseDetails } =
  monthlyExpenseDetailsSlice.actions;
export default monthlyExpenseDetailsSlice.reducer;
