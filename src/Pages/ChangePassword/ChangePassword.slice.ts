import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChangePasswordData, ChangePasswordResponse } from "../../type/changePassword";

interface ChangePasswordState {
  formData: ChangePasswordData;
  response: ChangePasswordResponse | null;
  success: string | null;
  error: string | null;
}

const initialState: ChangePasswordState = {
  formData: {
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  response: null,
  success: null,
  error: null,
};

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    // Update form data
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    // On success
    setChangePasswordSuccess: (state, action: PayloadAction<ChangePasswordResponse>) => {
      state.response = action.payload;
      state.success = action.payload.message;
      state.error = null;
    },

    // On error
    setChangePasswordError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.success = null;
      state.response = null;
    },

    // Reset state
    resetChangePassword: (state) => {
      state.formData = {
        username: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
      state.response = null;
      state.success = null;
      state.error = null;
    },
  },
});

export const {
  setFormData,
  setChangePasswordSuccess,
  setChangePasswordError,
  resetChangePassword,
} = changePasswordSlice.actions;

export default changePasswordSlice.reducer;
