import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Company, CompanyListState } from "../../../../type/company";

const initialState: CompanyListState = {
  list: [],
  pagination: null,
};

const companyListSlice = createSlice({
  name: "companyList",
  initialState,
  reducers: {
    setCompanyList: (
      state,
      action: PayloadAction<{
        data: Company[];
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
    deleteCompany: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (company) => company.company_id !== action.payload
      );
    },
  },
});

export const { setCompanyList, deleteCompany } = companyListSlice.actions;
export default companyListSlice.reducer;
