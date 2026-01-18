import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { CreateSpareState } from "../../../../type/spare";

const initialState: CreateSpareState = {
  spare_name: "",
};

const createSpareSlice = createSlice({
  name: "createSpare",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof CreateSpareState; value: string }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = createSpareSlice.actions;
export default createSpareSlice.reducer;
