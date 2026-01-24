import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditBankAccountState } from "../../../../type/bankAccount";

const initialState: EditBankAccountState = {
  account_name: "",
  account_number: "",
  opening_balance: "",
  activate_date: "",
};

const editBankAccountSlice = createSlice({
  name: "editBankAccount",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof EditBankAccountState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setFormData: (state, action: PayloadAction<EditBankAccountState>) => {
      return action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setField, setFormData, resetForm } = editBankAccountSlice.actions;
export default editBankAccountSlice.reducer;
