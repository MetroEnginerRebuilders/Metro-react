import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditSpareState } from "../../../../type/spare";

const initialState: EditSpareState = {
  spare_name: "",
};

const editSpareSlice = createSlice({
  name: "editSpare",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof EditSpareState; value: string }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    setSpareData: (_state, action: PayloadAction<EditSpareState>) => {
      return action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setField, setSpareData, resetForm } = editSpareSlice.actions;
export default editSpareSlice.reducer;
