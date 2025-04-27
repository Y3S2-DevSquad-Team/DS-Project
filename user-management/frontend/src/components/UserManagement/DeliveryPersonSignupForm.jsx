import React, { useState } from "react";
import { useInput } from "../../hooks/use-input";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThunk } from "../../hooks/use-thunk";
import { registerUser } from "../../store/thunks/userThunks";
import axios from "axios";
import showToast from "../../utils/toastNotifications";

import {
  isEmail,
  isNotEmpty,
  isPasswordStrong,
  isPasswordsMatch,
  isValidNumber,
} from "../../utils/Validation";

const DeliveryPersonSignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [doRegisterUser, isRegisteringUser] = useThunk(registerUser);

  // Form fields
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

  const [dialCode, setDialCode] = useState("+94");
  const {
    value: phoneNumber,
    handleInputChange: handlePhoneNumberChange,
    handleInputBlur: handlePhoneNumberBlur,
    hasError: phoneNumberHasError,
  } = useInput("", isValidNumber);
  const {
    value: vehicleType,
    handleInputChange: handleVehicleTypeChange,
    handleInputBlur: handleVehicleTypeBlur,
    hasError: vehicleTypeHasError,
  } = useInput("", isNotEmpty);

  const {
    value: licenseNumber,
    handleInputChange: handleLicenseNumberChange,
    handleInputBlur: handleLicenseNumberBlur,
    hasError: licenseNumberHasError,
  } = useInput("", isNotEmpty);

  const {
    value: nic,
    handleInputChange: handleNICChange,
    handleInputBlur: handleNICBlur,
    hasError: nicHasError,
  } = useInput("", isNotEmpty);

  const [businessCertificate, setBusinessCertificate] = useState(null);

  const isValid =
    username &&
    !usernameHasError &&
    email &&
    !emailHasError &&
    password &&
    !passwordHasError &&
    confirmPassword &&
    !confirmPasswordHasError &&
    phoneNumber &&
    !phoneNumberHasError &&
    vehicleType &&
    !vehicleTypeHasError &&
    licenseNumber &&
    !licenseNumberHasError &&
    nic &&
    !nicHasError;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      showToast("error", "Please fix validation errors before submitting");
      return;
    }

    const payload = {
      username,
      email,
      password,
      phone: `${dialCode}${phoneNumber}`,
      vehicleType,
      licenseNumber,
      nic,
    };

    const result = await doRegisterUser(payload);
    if (result.success) {
      showToast("success", "Delivery Person Registered Successfully");
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
      <h2 className="text-xl font-bold mb-4 text-[#06C167]">
        Delivery Person Signup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Credentials */}
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

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Country Dial Code Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-1">
              Country Code *
            </label>
            <select
              className="form-select w-full bg-[#1f1f1f] text-white rounded-md border border-gray-600 p-2"
              value={dialCode}
              onChange={(e) => setDialCode(e.target.value)}
            >
              <option value="">Select Country Code</option>
              <option value="+94">🇱🇰 +94 (Sri Lanka)</option>
              <option value="+1">🇺🇸 +1 (USA)</option>
              <option value="+44">🇬🇧 +44 (UK)</option>
              <option value="+61">🇦🇺 +61 (Australia)</option>
              {/* ➔ You can add more countries if needed */}
            </select>
          </div>

          {/* Phone Number Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              className="form-input w-full bg-[#1f1f1f] text-white rounded-md border border-gray-600 p-2"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onBlur={handlePhoneNumberBlur}
            />
          </div>
          <div>
            <label>Vehicle Type *</label>
            <input
              className="form-input"
              value={vehicleType}
              onChange={handleVehicleTypeChange}
              onBlur={handleVehicleTypeBlur}
            />
            {vehicleTypeHasError && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label>License Number *</label>
            <input
              className="form-input"
              value={licenseNumber}
              onChange={handleLicenseNumberChange}
              onBlur={handleLicenseNumberBlur}
            />
            {licenseNumberHasError && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>
          <div>
            <label>NIC *</label>
            <input
              className="form-input"
              value={nic}
              onChange={handleNICChange}
              onBlur={handleNICBlur}
            />
            {nicHasError && <p className="text-red-500 text-sm">Required</p>}
          </div>
        </div>

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

export default DeliveryPersonSignupForm;
