import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CreateShopState {
  shopName: string;
  shopAddress: string;
  shopPhoneNumber: string;
  loading: boolean;
  success: string | null;
  error: string | null;
}

export type CreateShopFields = keyof Pick<CreateShopState, 'shopName' | 'shopAddress' | 'shopPhoneNumber'>;

const initialState: CreateShopState = {
  shopName: "",
  shopAddress: "",
  shopPhoneNumber: "",
  loading: false,
  success: null,
  error: null,
};

const createShopSlice = createSlice({
  name: "createShop",
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<{ field: CreateShopFields; value: string }>) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    setShopName: (state, action: PayloadAction<string>) => {
      state.shopName = action.payload;
    },

    setShopAddress: (state, action: PayloadAction<string>) => {
      state.shopAddress = action.payload;
    },

    setShopPhoneNumber: (state, action: PayloadAction<string>) => {
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

    resetCreateShop: (state) => {
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
  setShopName,
  setShopAddress,
  setShopPhoneNumber,
  setLoading,
  setSuccess,
  setError,
  resetCreateShop,
} = createShopSlice.actions;

export default createShopSlice.reducer;