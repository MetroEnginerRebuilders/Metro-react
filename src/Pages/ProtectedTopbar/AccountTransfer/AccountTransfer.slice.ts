import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AccountTransferState } from "../../../type/bankAccount";

const initialState: AccountTransferState = {
  from_account_id: "",
  to_account_id: "",
  amount: "",
  transfer_date: "",
};

const accountTransferSlice = createSlice({
  name: "accountTransfer",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof AccountTransferState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = accountTransferSlice.actions;
export default accountTransferSlice.reducer;
