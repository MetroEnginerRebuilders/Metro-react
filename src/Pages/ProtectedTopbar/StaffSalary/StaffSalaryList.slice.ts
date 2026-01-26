import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StaffSalary, StaffSalaryListState } from "../../../type/staffSalary";

const initialState: StaffSalaryListState = {
  list: [],
  pagination: null,
};

const staffSalaryListSlice = createSlice({
  name: "staffSalaryList",
  initialState,
  reducers: {
    setStaffSalaryList: (
      state,
      action: PayloadAction<{
        data: StaffSalary[];
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
    deleteStaffSalary: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (salary) => salary.staff_salary_id !== action.payload
      );
    },
  },
});

export const { setStaffSalaryList, deleteStaffSalary } = staffSalaryListSlice.actions;
export default staffSalaryListSlice.reducer;
