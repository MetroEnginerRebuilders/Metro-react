import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Shop, Pagination } from "../../../../type/shops";

interface ShopState {
  list: Shop[];
  pagination: Pagination | null;
}

const initialState: ShopState = {
  list: [],
  pagination: null,
};

const shopSlice = createSlice({
  name: "shoplist",
  initialState,
  reducers: {
    // Set shop list with pagination
    setShopList(
      state,
      action: PayloadAction<{ data: Shop[]; pagination: Pagination }>
    ) {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },

    // Add new shop (prepend to list)
    addShop(
      state,
      action: PayloadAction<Shop>
    ) {
      state.list = [action.payload, ...state.list];
      if (state.pagination) {
        state.pagination.totalItems += 1;
      }
    },

    // Update shop
    updateShop(
      state,
      action: PayloadAction<Shop>
    ) {
      const index = state.list.findIndex(
        (s) => s.shop_id === action.payload.shop_id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    // Delete shop
    deleteShop(
      state,
      action: PayloadAction<string>
    ) {
      state.list = state.list.filter(
        (s) => s.shop_id !== action.payload
      );
      if (state.pagination) {
        state.pagination.totalItems -= 1;
      }
    },
  },
});

export const {
  setShopList,
  addShop,
  updateShop,
  deleteShop,
} = shopSlice.actions;

export default shopSlice.reducer;