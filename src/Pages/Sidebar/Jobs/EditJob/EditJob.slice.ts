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

const editJobSlice = createSlice({
  name: "editJob",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateJobState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setFormData: (_state, action: PayloadAction<CreateJobState>) => {
      return action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setField, setFormData, resetForm } = editJobSlice.actions;
export default editJobSlice.reducer;
