import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  fetchUserProfile,
  updateUser,
} from "../thunks/userThunks";

const initialState = {
  currentUser: null,
  updateUser: null,
  openedModalName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogout: (state) => {
      state.currentUser = null;
      state.updateUser = null;
      state.openedModalName = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    openModel: (state, action) => {
      state.openedModalName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        state.currentUser = user;
      })

      // Login User
      .addCase(loginUser.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        state.currentUser = user;
      })

      // Fetch User Profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const { userLogout, openModel } = userSlice.actions;
export default userSlice.reducer;
