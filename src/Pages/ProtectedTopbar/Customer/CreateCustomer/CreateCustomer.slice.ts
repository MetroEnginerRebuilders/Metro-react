import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateCustomerState } from "../../../../type/customer";

const initialState: CreateCustomerState = {
  customer_name: "",
  customer_address1: "",
  customer_address2: "",
  customer_phone_number: "",
  customer_type_id: null,
};

const createCustomerSlice = createSlice({
  name: "createCustomer",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateCustomerState; value: string | number | null }>
    ) => {
      const { field, value } = action.payload;
      (state[field] as any) = value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createCustomerSlice.actions;
export default createCustomerSlice.reducer;
