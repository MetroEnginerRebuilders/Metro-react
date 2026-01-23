import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Model, ModelListState } from "../../../../type/model";

const initialState: ModelListState = {
  list: [],
  pagination: null,
};

const modelListSlice = createSlice({
  name: "modellist",
  initialState,
  reducers: {
    setModelList: (
      state,
      action: PayloadAction<{
        data: Model[];
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
    deleteModel: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (model) => model.model_id !== action.payload
      );
    },
  },
});

export const { setModelList, deleteModel } = modelListSlice.actions;
export default modelListSlice.reducer;
