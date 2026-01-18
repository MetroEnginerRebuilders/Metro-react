import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Work } from "../../../../type/works";

interface EditWorkState {
  selectedWork: Work | null;
  workName: string;
  loading: boolean;
  success: string | null;
  error: string | null;
}

const initialState: EditWorkState = {
  selectedWork: null,
  workName: "",
  loading: false,
  success: null,
  error: null,
};

const editWorkSlice = createSlice({
  name: "editWork",
  initialState,
  reducers: {
    setSelectedWork: (state, action: PayloadAction<Work | null>) => {
      state.selectedWork = action.payload;
      state.workName = action.payload?.work_name || "";
    },

    setWorkName: (state, action: PayloadAction<string>) => {
      state.workName = action.payload;
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

    resetEditWork: (state) => {
      state.selectedWork = null;
      state.workName = "";
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
});

export const {
  setSelectedWork,
  setWorkName,
  setLoading,
  setSuccess,
  setError,
  resetEditWork,
} = editWorkSlice.actions;

export default editWorkSlice.reducer;