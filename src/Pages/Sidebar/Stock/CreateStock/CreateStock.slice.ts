import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface StockItem {
  companyId: string;
  modelId: string;
  itemId: string;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
}

export interface CreateStockState {
  shopId: string;
  transactionType: string;
  transactionTypeId: string;
  bankAccountId: string;
  orderDate: string;
  description: string;
  items: StockItem[];
  totalAmount: string;
}

const initialItem: StockItem = {
  companyId: "",
  modelId: "",
  itemId: "",
  quantity: "",
  unitPrice: "",
  lineTotal: "0",
};

const initialState: CreateStockState = {
  shopId: "",
  transactionType: "PURCHASE",
  transactionTypeId: "",
  bankAccountId: "",
  orderDate: "",
  description: "",
  items: [{ ...initialItem }],
  totalAmount: "0",
};

const createStockSlice = createSlice({
  name: "createStock",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof Omit<CreateStockState, 'items'>; value: string }>
    ) => {
      const { field, value } = action.payload;
      (state as any)[field] = value;
    },
    
    setItemField: (
      state,
      action: PayloadAction<{ index: number; field: keyof StockItem; value: string }>
    ) => {
      const { index, field, value } = action.payload;
      if (state.items[index]) {
        state.items[index][field] = value;
        
        // Auto-calculate lineTotal when quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          const quantity = parseFloat(state.items[index].quantity) || 0;
          const unitPrice = parseFloat(state.items[index].unitPrice) || 0;
          state.items[index].lineTotal = (quantity * unitPrice).toFixed(2);
          
          // Recalculate total amount
          const total = state.items.reduce((sum, item) => {
            return sum + (parseFloat(item.lineTotal) || 0);
          }, 0);
          state.totalAmount = total.toFixed(2);
        }
      }
    },
    
    addItem: (state) => {
      state.items.push({ ...initialItem });
    },
    
    removeItem: (state, action: PayloadAction<number>) => {
      if (state.items.length > 1) {
        state.items.splice(action.payload, 1);
        
        // Recalculate total amount
        const total = state.items.reduce((sum, item) => {
          return sum + (parseFloat(item.lineTotal) || 0);
        }, 0);
        state.totalAmount = total.toFixed(2);
      }
    },
    
    resetForm: () => initialState,
  },
});

export const { setField, setItemField, addItem, removeItem, resetForm } = createStockSlice.actions;
export default createStockSlice.reducer;
