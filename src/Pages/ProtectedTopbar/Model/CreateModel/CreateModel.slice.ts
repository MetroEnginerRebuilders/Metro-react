import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateModelState } from "../../../../type/model";

const initialState: CreateModelState = {
  model_name: "",
};

const createModelSlice = createSlice({
  name: "createModel",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateModelState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createModelSlice.actions;
export default createModelSlice.reducer;
