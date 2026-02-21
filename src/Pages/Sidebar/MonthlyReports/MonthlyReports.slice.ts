import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MonthlyReportData } from "../../../type/monthlyReport";

interface MonthlyReportsState {
  selectedMonth: string;
  selectedYear: string;
  loading: boolean;
  printLoading: boolean;
  data: MonthlyReportData | null;
  error: string | null;
}

const initialState: MonthlyReportsState = {
  selectedMonth: "",
  selectedYear: "",
  loading: false,
  printLoading: false,
  data: null,
  error: null,
};

const monthlyReportsSlice = createSlice({
  name: "monthlyReports",
  initialState,
  reducers: {
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPrintLoading: (state, action: PayloadAction<boolean>) => {
      state.printLoading = action.payload;
    },
    setData: (state, action: PayloadAction<MonthlyReportData | null>) => {
      state.data = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedMonth,
  setSelectedYear,
  setLoading,
  setPrintLoading,
  setData,
  setError,
} = monthlyReportsSlice.actions;

export default monthlyReportsSlice.reducer;
