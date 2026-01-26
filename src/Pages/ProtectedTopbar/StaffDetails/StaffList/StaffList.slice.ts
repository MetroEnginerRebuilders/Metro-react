import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Staff, StaffListState } from "../../../../type/staff";

const initialState: StaffListState = {
  list: [],
  pagination: null,
};

const staffListSlice = createSlice({
  name: "staffList",
  initialState,
  reducers: {
    setStaffList: (
      state,
      action: PayloadAction<{
        data: Staff[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }>
    ) => {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    deleteStaff: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (staff) => staff.staff_id !== action.payload
      );
    },
  },
});

export const { setStaffList, deleteStaff } = staffListSlice.actions;
export default staffListSlice.reducer;
