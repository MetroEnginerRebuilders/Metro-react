import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditStaffSalaryState } from "../../../type/staffSalary";

const initialState: EditStaffSalaryState = {
  staff_id: "",
  bank_account_id: "",
  effective_date: "",
  amount: "",
  salary_type_id: "",
  remarks: "",
};

const editStaffSalarySlice = createSlice({
  name: "editStaffSalary",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof EditStaffSalaryState; value: string }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    setFormData: (state, action: PayloadAction<EditStaffSalaryState>) => {
      return { ...state, ...action.payload };
    },
    resetForm: () => initialState,
  },
});

export const { setField, setFormData, resetForm } = editStaffSalarySlice.actions;
export default editStaffSalarySlice.reducer;
