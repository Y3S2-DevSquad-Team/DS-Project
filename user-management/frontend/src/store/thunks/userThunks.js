import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/api";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data) => {
    const url = data.deliveryAddresses
      ? "/auth/signup/customer"
      : "/auth/signup/delivery";
    const response = await api.post(url, data);
    return response.data;
  }
);

export const loginUser = createAsyncThunk("auth/loginUser", async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
});
