import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Spare, SpareListState } from "../../../../type/spare";

const initialState: SpareListState = {
  list: [],
  pagination: null,
};

const spareListSlice = createSlice({
  name: "sparelist",
  initialState,
  reducers: {
    setSpareList: (
      state,
      action: PayloadAction<{
        data: Spare[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      }>
    ) => {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    deleteSpare: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(
        (spare) => spare.spare_id !== action.payload
      );
    },
  },
});

export const { setSpareList, deleteSpare } = spareListSlice.actions;
export default spareListSlice.reducer;
