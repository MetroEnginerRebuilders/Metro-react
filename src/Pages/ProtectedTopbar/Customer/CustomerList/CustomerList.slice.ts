import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Customer, CustomerListState } from "../../../../type/customer";

const initialState: CustomerListState = {
  list: [],
  pagination: null,
};

const customerListSlice = createSlice({
  name: "customerlist",
  initialState,
  reducers: {
    setCustomerList: (
      state,
      action: PayloadAction<{
        data: Customer[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      }>
    ) => {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (customer) => customer.customer_id !== action.payload
      );
    },
  },
});

export const { setCustomerList, deleteCustomer } = customerListSlice.actions;
export default customerListSlice.reducer;
