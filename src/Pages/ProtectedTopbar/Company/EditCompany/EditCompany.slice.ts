import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditCompanyState } from "../../../../type/company";

const initialState: EditCompanyState = {
  company_name: "",
  executive_name: "",
  executive_phone_number: "",
};

const editCompanySlice = createSlice({
  name: "editCompany",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof EditCompanyState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setFormData: (_state, action: PayloadAction<EditCompanyState>) => {
      return action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setField, setFormData, resetForm } = editCompanySlice.actions;
export default editCompanySlice.reducer;
