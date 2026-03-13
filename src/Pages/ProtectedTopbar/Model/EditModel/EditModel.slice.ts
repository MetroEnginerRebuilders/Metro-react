import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditModelState } from "../../../../type/model";

const initialState: EditModelState = {
  model_name: "",
};

const editModelSlice = createSlice({
  name: "editModel",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof EditModelState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setFormData: (_state, action: PayloadAction<EditModelState>) => {
      return action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setField, setFormData, resetForm } = editModelSlice.actions;
export default editModelSlice.reducer;
