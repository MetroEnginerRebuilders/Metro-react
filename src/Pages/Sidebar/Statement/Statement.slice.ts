import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StatementRecord, StatementType } from "../../../type/statement";

export interface StatementFilterOption {
  id: string;
  name: string;
}

interface StatementState {
  selectedType: StatementType;
  selectedReferenceId: string;
  showFilterErrors: boolean;
  customerOptions: StatementFilterOption[];
  shopOptions: StatementFilterOption[];
  optionsLoading: boolean;
  tableLoading: boolean;
  statementRows: StatementRecord[];
}

const initialState: StatementState = {
  selectedType: "customer",
  selectedReferenceId: "",
  showFilterErrors: false,
  customerOptions: [],
  shopOptions: [],
  optionsLoading: false,
  tableLoading: false,
  statementRows: [],
};

const statementSlice = createSlice({
  name: "statement",
  initialState,
  reducers: {
    setSelectedType: (state, action: PayloadAction<StatementType>) => {
      state.selectedType = action.payload;
    },
    setSelectedReferenceId: (state, action: PayloadAction<string>) => {
      state.selectedReferenceId = action.payload;
    },
    setShowFilterErrors: (state, action: PayloadAction<boolean>) => {
      state.showFilterErrors = action.payload;
    },
    setCustomerOptions: (state, action: PayloadAction<StatementFilterOption[]>) => {
      state.customerOptions = action.payload;
    },
    setShopOptions: (state, action: PayloadAction<StatementFilterOption[]>) => {
      state.shopOptions = action.payload;
    },
    setOptionsLoading: (state, action: PayloadAction<boolean>) => {
      state.optionsLoading = action.payload;
    },
    setTableLoading: (state, action: PayloadAction<boolean>) => {
      state.tableLoading = action.payload;
    },
    setStatementRows: (state, action: PayloadAction<StatementRecord[]>) => {
      state.statementRows = action.payload;
    },
    resetSelectedReferenceId: (state) => {
      state.selectedReferenceId = "";
    },
  },
});

export const {
  setSelectedType,
  setSelectedReferenceId,
  setShowFilterErrors,
  setCustomerOptions,
  setShopOptions,
  setOptionsLoading,
  setTableLoading,
  setStatementRows,
  resetSelectedReferenceId,
} = statementSlice.actions;

export default statementSlice.reducer;
