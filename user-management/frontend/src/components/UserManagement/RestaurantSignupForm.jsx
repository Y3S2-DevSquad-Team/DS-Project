import React, { useState } from "react";
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

const RestaurantSignupForm = () => {
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
    value: restaurantName,
    handleInputChange: handleRestaurantNameChange,
    handleInputBlur: handleRestaurantNameBlur,
    hasError: restaurantNameHasError,
  } = useInput("", isNotEmpty);

  const {
    value: location,
    handleInputChange: handleLocationChange,
    handleInputBlur: handleLocationBlur,
    hasError: locationHasError,
  } = useInput("", isNotEmpty);

  const {
    value: businessLicenseNumber,
    handleInputChange: handleBusinessLicenseNumberChange,
    handleInputBlur: handleBusinessLicenseNumberBlur,
    hasError: businessLicenseNumberHasError,
  } = useInput("", isNotEmpty);

  const {
    value: cuisineType,
    handleInputChange: handleCuisineTypeChange,
    handleInputBlur: handleCuisineTypeBlur,
    hasError: cuisineTypeHasError,
  } = useInput("", isNotEmpty);

  const [openingHours, setOpeningHours] = useState({ start: "", end: "" });
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    bankName: "",
    branchCode: "",
  });

  const handleOpeningHoursChange = (e, field) => {
    const { value } = e.target;
    setOpeningHours((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankDetailsChange = (e, field) => {
    const { value } = e.target;
    setBankDetails((prev) => ({ ...prev, [field]: value }));
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
    phoneNumber &&
    !phoneNumberHasError &&
    restaurantName &&
    !restaurantNameHasError &&
    location &&
    !locationHasError &&
    businessLicenseNumber &&
    !businessLicenseNumberHasError &&
    cuisineType &&
    !cuisineTypeHasError &&
    openingHours.start &&
    openingHours.end &&
    bankDetails.accountNumber &&
    bankDetails.bankName &&
    bankDetails.branchCode;

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
      restaurantName,
      location,
      businessLicenseNumber,
      cuisineType,
      openingHours,
      bankDetails,
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
      <h2 className="text-xl font-bold mb-4 text-[#06C167]">
        Restaurant Signup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Info */}
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
              <p className="text-red-500 text-sm">Valid email required</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        </div>

        {/* Restaurant Info */}
        <hr className="border-gray-700 my-4" />
        <h3 className="text-lg font-semibold text-[#06C167]">
          Restaurant Info
        </h3>
        <input
          placeholder="Restaurant Name"
          className="form-input"
          value={restaurantName}
          onChange={handleRestaurantNameChange}
          onBlur={handleRestaurantNameBlur}
        />
        <input
          placeholder="Location"
          className="form-input"
          value={location}
          onChange={handleLocationChange}
          onBlur={handleLocationBlur}
        />
        <input
          placeholder="Business License Number"
          className="form-input"
          value={businessLicenseNumber}
          onChange={handleBusinessLicenseNumberChange}
          onBlur={handleBusinessLicenseNumberBlur}
        />
        <input
          placeholder="Cuisine Type"
          className="form-input"
          value={cuisineType}
          onChange={handleCuisineTypeChange}
          onBlur={handleCuisineTypeBlur}
        />

        {/* Opening Hours */}
        <hr className="border-gray-700 my-4" />
        <h3 className="text-lg font-semibold text-[#06C167]">Opening Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="time"
            placeholder="Start Time"
            className="form-input"
            value={openingHours.start}
            onChange={(e) => handleOpeningHoursChange(e, "start")}
          />
          <input
            type="time"
            placeholder="End Time"
            className="form-input"
            value={openingHours.end}
            onChange={(e) => handleOpeningHoursChange(e, "end")}
          />
        </div>

        {/* Bank Details */}
        <hr className="border-gray-700 my-4" />
        <h3 className="text-lg font-semibold text-[#06C167]">Bank Details</h3>
        <input
          placeholder="Account Number"
          className="form-input"
          value={bankDetails.accountNumber}
          onChange={(e) => handleBankDetailsChange(e, "accountNumber")}
        />
        <input
          placeholder="Bank Name"
          className="form-input"
          value={bankDetails.bankName}
          onChange={(e) => handleBankDetailsChange(e, "bankName")}
        />
        <input
          placeholder="Branch Code"
          className="form-input"
          value={bankDetails.branchCode}
          onChange={(e) => handleBankDetailsChange(e, "branchCode")}
        />
        {/* Submit Button */}
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

export default RestaurantSignupForm;
