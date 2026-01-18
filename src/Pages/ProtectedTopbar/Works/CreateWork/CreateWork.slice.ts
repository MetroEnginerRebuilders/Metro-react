import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CreateWorkState {
  workName: string;
  loading: boolean;
  success: string | null;
  error: string | null;
}

const initialState: CreateWorkState = {
  workName: "",
  loading: false,
  success: null,
  error: null,
};

const createWorkSlice = createSlice({
  name: "createWork",
  initialState,
  reducers: {
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

    resetCreateWork: (state) => {
      state.workName = "";
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
});

export const {
  setWorkName,
  setLoading,
  setSuccess,
  setError,
  resetCreateWork,
} = createWorkSlice.actions;

export default createWorkSlice.reducer;