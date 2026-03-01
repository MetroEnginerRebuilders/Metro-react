import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardFinanceDateRangeItem } from "../../../type/dashboard";

interface MonthlyIncomeDetailsState {
  list: DashboardFinanceDateRangeItem[];
}

const initialState: MonthlyIncomeDetailsState = {
  list: [],
};

const monthlyIncomeDetailsSlice = createSlice({
  name: "monthlyIncomeDetails",
  initialState,
  reducers: {
    setMonthlyIncomeDetails: (state, action: PayloadAction<DashboardFinanceDateRangeItem[]>) => {
      state.list = action.payload;
    },
    clearMonthlyIncomeDetails: (state) => {
      state.list = [];
    },
  },
});

export const { setMonthlyIncomeDetails, clearMonthlyIncomeDetails } =
  monthlyIncomeDetailsSlice.actions;
export default monthlyIncomeDetailsSlice.reducer;
