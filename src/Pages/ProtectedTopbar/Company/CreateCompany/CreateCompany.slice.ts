import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateCompanyState } from "../../../../type/company";

const initialState: CreateCompanyState = {
  company_name: "",
  executive_name: "",
  executive_phone_number: "",
};

const createCompanySlice = createSlice({
  name: "createCompany",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateCompanyState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createCompanySlice.actions;
export default createCompanySlice.reducer;
