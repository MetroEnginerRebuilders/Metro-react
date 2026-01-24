import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BankAccount, BankAccountListState } from "../../../../type/bankAccount";

const initialState: BankAccountListState = {
  list: [],
  pagination: null,
};

const bankAccountListSlice = createSlice({
  name: "bankAccountList",
  initialState,
  reducers: {
    setBankAccountList: (
      state,
      action: PayloadAction<{
        data: BankAccount[];
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
    deleteBankAccount: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (account) => account.bank_account_id !== action.payload
      );
    },
  },
});

export const { setBankAccountList, deleteBankAccount } = bankAccountListSlice.actions;
export default bankAccountListSlice.reducer;
