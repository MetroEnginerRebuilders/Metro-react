import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponse } from "../../type/login";

interface LoginSlice {
  token: string | null;
}

const initialState: LoginSlice = {
  token: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginResponse: (state, action: PayloadAction<LoginResponse>) => {
      state.token = action.payload.data.token;
    },

    setLogout: (state) => {
      state.token = null;
    },
  },
});

export const { setLoginResponse, setLogout } = loginSlice.actions;
export default loginSlice.reducer;
