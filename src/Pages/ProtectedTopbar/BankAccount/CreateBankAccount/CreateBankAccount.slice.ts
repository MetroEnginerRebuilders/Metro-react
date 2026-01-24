import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateBankAccountState } from "../../../../type/bankAccount";

const initialState: CreateBankAccountState = {
  account_name: "",
  account_number: "",
  opening_balance: "",
  activate_date: "",
};

const createBankAccountSlice = createSlice({
  name: "createBankAccount",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateBankAccountState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createBankAccountSlice.actions;
export default createBankAccountSlice.reducer;
