import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Work, Pagination } from "../../../../type/works";

interface WorkState {
  list: Work[];
  pagination: Pagination | null;
}

const initialState: WorkState = {
  list: [],
  pagination: null,
};

const workSlice = createSlice({
  name: "worklist",
  initialState,
  reducers: {
    // Set work list with pagination
    setWorkList(
      state,
      action: PayloadAction<{ data: Work[]; pagination: Pagination }>
    ) {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },

    // Add new work (prepend to list)
    addWork(
      state,
      action: PayloadAction<Work>
    ) {
      state.list = [action.payload, ...state.list];
      if (state.pagination) {
        state.pagination.totalItems += 1;
      }
    },

    // Update work
    updateWork(
      state,
      action: PayloadAction<Work>
    ) {
      const index = state.list.findIndex(
        (w) => w.work_id === action.payload.work_id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    // Delete work
    deleteWork(
      state,
      action: PayloadAction<string>
    ) {
      state.list = state.list.filter(
        (w) => w.work_id !== action.payload
      );
      if (state.pagination) {
        state.pagination.totalItems -= 1;
      }
    },
  },
});

export const {
  setWorkList,
  addWork,
  updateWork,
  deleteWork,
} = workSlice.actions;

export default workSlice.reducer;
