import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Income, IncomeListState } from "../../../../type/income";

const initialState: IncomeListState = {
  list: [],
  pagination: null,
};

const incomeListSlice = createSlice({
  name: "incomeList",
  initialState,
  reducers: {
    setIncomeList: (
      state,
      action: PayloadAction<{
        data: Income[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }>
    ) => {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    deleteIncome: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (income) => income.finance_id !== action.payload
      );
    },
  },
});

export const { setIncomeList, deleteIncome } = incomeListSlice.actions;
export default incomeListSlice.reducer;
