import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateExpenseState } from "../../../../type/expense";

const initialState: CreateExpenseState = {
  transaction_date: "",
  amount: "",
  description: "",
  bank_account_id: "",
  remarks: "",
  finance_category_id: "",
};

const createExpenseSlice = createSlice({
  name: "createExpense",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateExpenseState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createExpenseSlice.actions;
export default createExpenseSlice.reducer;
