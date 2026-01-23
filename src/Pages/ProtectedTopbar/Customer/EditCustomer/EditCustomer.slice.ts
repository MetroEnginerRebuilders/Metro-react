import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditCustomerState } from "../../../../type/customer";

const initialState: EditCustomerState = {
  customer_name: "",
  customer_address1: "",
  customer_address2: "",
  customer_phone_number: "",
  customer_type_id: null,
};

const editCustomerSlice = createSlice({
  name: "editCustomer",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof EditCustomerState; value: string | number | null }>
    ) => {
      const { field, value } = action.payload;
      (state[field] as any) = value;
    },
    setCustomerData: (_state, action: PayloadAction<any>) => {
      return {
        customer_name: action.payload.customer_name,
        customer_address1: action.payload.customer_address1,
        customer_address2: action.payload.customer_address2,
        customer_phone_number: action.payload.customer_phone_number,
        customer_type_id: action.payload.customer_type_id,
      };
    },
    resetForm: () => initialState,
  },
});

export const { setField, setCustomerData, resetForm } = editCustomerSlice.actions;
export default editCustomerSlice.reducer;
