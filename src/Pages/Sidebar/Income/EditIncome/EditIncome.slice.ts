import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditIncomeState, Income } from "../../../../type/income";

const initialState: EditIncomeState = {
  transaction_date: "",
  amount: "",
  description: "",
  bank_account_id: "",
  remarks: "",
  finance_category_id: "",
};

const editIncomeSlice = createSlice({
  name: "editIncome",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof EditIncomeState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setIncomeData: (_state, action: PayloadAction<Income>) => {
      // Format transaction_date from ISO string to YYYY-MM-DD for date input
      const formatDateForInput = (isoDate: string) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      return {
        transaction_date: formatDateForInput(action.payload.transaction_date),
        amount: action.payload.amount,
        description: action.payload.description || "",
        bank_account_id: action.payload.bank_account_id,
        remarks: action.payload.remarks || "",
        finance_category_id: action.payload.finance_category_id,
      };
    },
    resetForm: () => initialState,
  },
});

export const { setField, setIncomeData, resetForm } = editIncomeSlice.actions;
export default editIncomeSlice.reducer;
