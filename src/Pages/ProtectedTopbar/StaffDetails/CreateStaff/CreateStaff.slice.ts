import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateStaffState } from "../../../../type/staff";

const initialState: CreateStaffState = {
  staff_name: "",
  salary: "",
  active_date: "",
};

const createStaffSlice = createSlice({
  name: "createStaff",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateStaffState; value: string }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createStaffSlice.actions;
export default createStaffSlice.reducer;
