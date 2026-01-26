import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditStaffState } from "../../../../type/staff";

const initialState: EditStaffState = {
  staff_name: "",
  salary: "",
  active_date: "",
  inactive_date: "",
};

const editStaffSlice = createSlice({
  name: "editStaff",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof EditStaffState; value: string }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    setFormData: (state, action: PayloadAction<EditStaffState>) => {
      return { ...state, ...action.payload };
    },
    resetForm: () => initialState,
  },
});

export const { setField, setFormData, resetForm } = editStaffSlice.actions;
export default editStaffSlice.reducer;
