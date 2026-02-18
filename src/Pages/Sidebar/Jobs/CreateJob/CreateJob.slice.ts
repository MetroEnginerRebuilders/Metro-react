import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateJobState } from "../../../../type/job";

const initialState: CreateJobState = {
  customer_id: "",
  description: "",
  start_date: "",
  received_items: "",
  advance_amount: "",
  bank_account_id: "",
};

const createJobSlice = createSlice({
  name: "createJob",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateJobState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createJobSlice.actions;
export default createJobSlice.reducer;
