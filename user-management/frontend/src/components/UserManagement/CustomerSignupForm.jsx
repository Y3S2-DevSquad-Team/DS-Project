// File: components/CustomerSignupForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useInput } from "../../hooks/use-input";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThunk } from "../../hooks/use-thunk";
import { registerUser } from "../../store/thunks/userThunks";
import showToast from "../../utils/toastNotifications";

import {
  isEmail,
  isNotEmpty,
  isPasswordStrong,
  isPasswordsMatch,
  isValidNumber,
} from "../../utils/Validation";

const CustomerSignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [doRegisterUser, isRegisteringUser] = useThunk(registerUser);

  // Form fields using useInput
  const {
    value: username,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
  } = useInput("", isNotEmpty);

  const {
    value: email,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput("", isEmail);

  const {
    value: password,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
  } = useInput("", isPasswordStrong);

  const {
    value: confirmPassword,
    handleInputChange: handleConfirmPasswordChange,
    handleInputBlur: handleConfirmPasswordBlur,
    hasError: confirmPasswordHasError,
  } = useInput("", (value) => isPasswordsMatch(password, value));

  const {
    value: phone,
    handleInputChange: handlePhoneChange,
    handleInputBlur: handlePhoneBlur,
    hasError: phoneHasError,
  } = useInput("", isValidNumber);

  const [address, setAddress] = useState({
    label: "",
    address: "",
  });
  const [addressError, setAddressError] = useState("");

  const handleAddressChange = (e, field) => {
    const { value } = e.target;
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const { label, address: addrValue } = address;
    if (!label || !address) {
      setAddressError("Complete delivery address is required");
      return false;
    }
    setAddressError("");
    return true;
  };

  const isValid =
    username &&
    !usernameHasError &&
    email &&
    !emailHasError &&
    password &&
    !passwordHasError &&
    confirmPassword &&
    !confirmPasswordHasError &&
    phone &&
    !phoneHasError &&
    address.label &&
    address.address &&
    !addressError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAddressValid = validateAddress();

    if (
      usernameHasError ||
      emailHasError ||
      passwordHasError ||
      confirmPasswordHasError ||
      phoneHasError ||
      !isAddressValid
    ) {
      showToast("error", "Please fix validation errors before submitting");
      return;
    }

    const payload = {
      username,
      email,
      password,
      phone,
      deliveryAddresses: [address],
    };

    const result = await doRegisterUser(payload);
    if (result.success) {
      showToast("success", "Signup successful");
      const redirect = localStorage.getItem("redirectAfterLogin");
      if (redirect) {
        navigate(redirect);
        localStorage.removeItem("redirectAfterLogin");
      }
    } else {
      showToast("error", result.error.message || "Signup failed");
    }
  };

  return (
    <div className="p-6 bg-[#121212] text-white w-full h-full">
      <h2 className="text-xl font-bold mb-4 text-[#06C167]">Customer Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label>Username *</label>
            <input
              className="form-input"
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
            />
            {usernameHasError && (
              <p className="text-red-500 text-sm">Username is required</p>
            )}
          </div>
          <div>
            <label>Email *</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />
            {emailHasError && (
              <p className="text-red-500 text-sm">Enter a valid email</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label>Password *</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
            />
            {passwordHasError && (
              <p className="text-red-500 text-sm">Strong password required</p>
            )}
          </div>
          <div>
            <label>Confirm Password *</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
            />
            {confirmPasswordHasError && (
              <p className="text-red-500 text-sm">Passwords must match</p>
            )}
          </div>
        </div>

        <div>
          <label>Phone Number *</label>
          <input
            className="form-input"
            value={phone}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
          />
          {phoneHasError && (
            <p className="text-red-500 text-sm">Enter a valid phone number</p>
          )}
        </div>

        <hr className="border-gray-700 my-4" />
        <h3 className="text-lg font-semibold text-[#06C167]">
          Delivery Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            placeholder="Label"
            className="form-input"
            value={address.label}
            onChange={(e) => handleAddressChange(e, "label")}
          />
          <input
            placeholder="Address"
            className="form-input"
            value={address.address}
            onChange={(e) => handleAddressChange(e, "address")}
          />
        </div>
        {addressError && (
          <p className="text-red-500 text-sm mt-2">{addressError}</p>
        )}

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full mt-6 py-3 font-bold rounded-md transition-colors duration-300 ${
            isValid
              ? "bg-[#06C167] hover:bg-[#04894e] text-black cursor-pointer"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {isRegisteringUser ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default CustomerSignupForm;
