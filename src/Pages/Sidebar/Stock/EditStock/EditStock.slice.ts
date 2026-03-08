import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface EditStockItem {
	companyId: string;
	modelId: string;
	itemId: string;
	quantity: string;
	unitPrice: string;
	lineTotal: string;
}

export interface EditStockState {
	shopId: string;
	transactionType: string;
	transactionTypeId: string;
	bankAccountId: string;
	orderDate: string;
	description: string;
	items: EditStockItem[];
	totalAmount: string;
}

const initialItem: EditStockItem = {
	companyId: "",
	modelId: "",
	itemId: "",
	quantity: "",
	unitPrice: "",
	lineTotal: "0",
};

const initialState: EditStockState = {
	shopId: "",
	transactionType: "PURCHASE",
	transactionTypeId: "",
	bankAccountId: "",
	orderDate: "",
	description: "",
	items: [{ ...initialItem }],
	totalAmount: "0",
};

const editStockSlice = createSlice({
	name: "editStock",
	initialState,
	reducers: {
		setField: (
			state,
			action: PayloadAction<{ field: keyof Omit<EditStockState, "items">; value: string }>
		) => {
			const { field, value } = action.payload;
			(state as any)[field] = value;
		},
		setItemField: (
			state,
			action: PayloadAction<{ index: number; field: keyof EditStockItem; value: string }>
		) => {
			const { index, field, value } = action.payload;
			if (state.items[index]) {
				state.items[index][field] = value;
				if (field === "quantity" || field === "unitPrice") {
					const quantity = parseFloat(state.items[index].quantity) || 0;
					const unitPrice = parseFloat(state.items[index].unitPrice) || 0;
					state.items[index].lineTotal = (quantity * unitPrice).toFixed(2);
					const total = state.items.reduce((sum, item) => sum + (parseFloat(item.lineTotal) || 0), 0);
					state.totalAmount = total.toFixed(2);
				}
			}
		},
		setFormData: (_state, action: PayloadAction<EditStockState>) => action.payload,
		addItem: (state) => {
			state.items.push({ ...initialItem });
		},
		removeItem: (state, action: PayloadAction<number>) => {
			if (state.items.length > 1) {
				state.items.splice(action.payload, 1);
				const total = state.items.reduce((sum, item) => sum + (parseFloat(item.lineTotal) || 0), 0);
				state.totalAmount = total.toFixed(2);
			}
		},
		resetForm: () => initialState,
	},
});

export const { setField, setItemField, setFormData, addItem, removeItem, resetForm } = editStockSlice.actions;
export default editStockSlice.reducer;
