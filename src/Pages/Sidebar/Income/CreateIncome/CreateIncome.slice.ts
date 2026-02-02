import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateIncomeState } from "../../../../type/income";

const initialState: CreateIncomeState = {
  transaction_date: "",
  amount: "",
  description: "",
  bank_account_id: "",
  remarks: "",
  finance_category_id: "",
};

const createIncomeSlice = createSlice({
  name: "createIncome",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateIncomeState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createIncomeSlice.actions;
export default createIncomeSlice.reducer;
