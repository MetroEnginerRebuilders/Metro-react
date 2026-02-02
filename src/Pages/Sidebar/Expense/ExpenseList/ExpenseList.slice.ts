import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Expense, ExpenseListState } from "../../../../type/expense";

const initialState: ExpenseListState = {
  list: [],
  pagination: null,
};

const expenseListSlice = createSlice({
  name: "expenseList",
  initialState,
  reducers: {
    setExpenseList: (
      state,
      action: PayloadAction<{
        data: Expense[];
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
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (expense) => expense.finance_id !== action.payload
      );
    },
  },
});

export const { setExpenseList, deleteExpense } = expenseListSlice.actions;
export default expenseListSlice.reducer;
