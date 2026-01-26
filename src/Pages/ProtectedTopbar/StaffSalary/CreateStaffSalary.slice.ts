import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateStaffSalaryState } from "../../../type/staffSalary";

const initialState: CreateStaffSalaryState = {
  staff_id: "",
  bank_account_id: "",
  effective_date: "",
  amount: "",
  salary_type_id: "",
  remarks: "",
};

const createStaffSalarySlice = createSlice({
  name: "createStaffSalary",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateStaffSalaryState; value: string }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createStaffSalarySlice.actions;
export default createStaffSalarySlice.reducer;
