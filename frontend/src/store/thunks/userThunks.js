import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/api";

export const registerUser = createAsyncThunk("auth/registerUser", async (data) => {
  let url = "";

  if (data.deliveryAddresses) {
    url = "/api/auth/api/auth/signup/customer";
  } else if (data.vehicleType && data.licenseNumber && data.nic) {
    url = "/api/auth/api/auth/signup/delivery";
  } else if (data.restaurantName && data.businessLicenseNumber && data.bankDetails) {
    url = "/api/auth/api/auth/signup/restaurant";
  } else {
    throw new Error("Invalid signup data");
  }

  const response = await api.post(url, data);
  return response.data;
});

export const loginUser = createAsyncThunk("auth/loginUser", async (data) => {
  const response = await api.post("/api/auth/api/auth/login", data);
  return response.data;
});
