import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Shop } from "../../../../type/shops";

interface EditShopState {
  selectedShop: Shop | null;
  shopName: string;
  shopAddress: string;
  shopPhoneNumber: string;
  loading: boolean;
  success: string | null;
  error: string | null;
}

type EditShopFields = keyof Pick<EditShopState, 'shopName' | 'shopAddress' | 'shopPhoneNumber'>;

const initialState: EditShopState = {
  selectedShop: null,
  shopName: "",
  shopAddress: "",
  shopPhoneNumber: "",
  loading: false,
  success: null,
  error: null,
};

const editShopSlice = createSlice({
  name: "editShop",
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<{ field: EditShopFields; value: string }>) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    setSelectedShop: (state, action: PayloadAction<Shop | null>) => {
      state.selectedShop = action.payload;
      state.shopName = action.payload?.shop_name || "";
      state.shopAddress = action.payload?.shop_address || "";
      state.shopPhoneNumber = action.payload?.shop_phone_number || "";
    },

    setShopName: (state, action: PayloadAction<string>) => {
      state.shopName = action.payload;
    },

    setshopAddress: (state, action: PayloadAction<string>) => {
      state.shopAddress = action.payload;
    },

    setshopPhoneNumber: (state, action: PayloadAction<string>) => {
      state.shopPhoneNumber = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setSuccess: (state, action: PayloadAction<string>) => {
      state.success = action.payload;
      state.error = null;
      state.loading = false;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.success = null;
      state.loading = false;
    },

    resetEditShop: (state) => {
      state.selectedShop = null;
      state.shopName = "";
      state.shopAddress = "";
      state.shopPhoneNumber = "";
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
});

export const {
  setField,
  setSelectedShop,
  setShopName,
  setshopAddress,
  setshopPhoneNumber,
  setLoading,
  setSuccess,
  setError,
  resetEditShop,
} = editShopSlice.actions;

export type { EditShopFields };
export default editShopSlice.reducer;