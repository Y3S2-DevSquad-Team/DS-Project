import React, { useState } from "react";
import { useInput } from "../../hooks/use-input";
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
  const navigate = useNavigate();
  const [doRegisterUser, isRegisteringUser] = useThunk(registerUser);

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

  const [address, setAddress] = useState({ label: "", address: "" });
  const [addressError, setAddressError] = useState("");

  const validateAddress = () => {
    if (!address.label || !address.address) {
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
    phoneNumber &&
    !phoneNumberHasError &&
    address.label &&
    address.address &&
    !addressError;

  const handleAddressChange = (e, field) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    const payload = {
      username,
      email,
      password,
      dialCode,
      phone: `${dialCode}${phoneNumber}`,
      deliveryAddresses: [address],
    };

    const result = await doRegisterUser(payload);
    if (result.success) {
      showToast("success", "Signup successful");
      navigate("/login");
    } else {
      showToast("error", result.error.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center min-h-screen text-gray-800 bg-gray-100 ml-64">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="mb-4 text-2xl font-bold text-center text-green-600">
          Customer Signup
        </h2>

        {/* Username & Email */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-semibold">
              Username *
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              placeholder="Enter username"
            />
            {usernameHasError && (
              <p className="mt-1 text-sm text-red-500">Username is required</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Email *</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="Enter email"
            />
            {emailHasError && (
              <p className="mt-1 text-sm text-red-500">Enter a valid email</p>
            )}
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-semibold">
              Password *
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              placeholder="Enter password"
            />
            {passwordHasError && (
              <p className="mt-1 text-sm text-red-500">
                Strong password required
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Confirm Password *
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              placeholder="Re-enter password"
            />
            {confirmPasswordHasError && (
              <p className="mt-1 text-sm text-red-500">Passwords must match</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-semibold">
              Country Code *
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={dialCode}
              onChange={(e) => setDialCode(e.target.value)}
            >
              <option value="+94">🇱🇰 +94 (Sri Lanka)</option>
              <option value="+1">🇺🇸 +1 (USA)</option>
              <option value="+44">🇬🇧 +44 (UK)</option>
              <option value="+61">🇦🇺 +61 (Australia)</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Phone Number *
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onBlur={handlePhoneNumberBlur}
              placeholder="Enter phone number"
            />
            {phoneNumberHasError && (
              <p className="mt-1 text-sm text-red-500">
                Enter a valid phone number
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-semibold">
              Address Label *
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={address.label}
              onChange={(e) => handleAddressChange(e, "label")}
              placeholder="e.g., Home, Office"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Full Address *
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={address.address}
              onChange={(e) => handleAddressChange(e, "address")}
              placeholder="Enter full address"
            />
          </div>
        </div>

        {addressError && (
          <p className="mt-2 text-sm text-red-500">{addressError}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full mt-6 py-3 font-bold rounded-md transition-colors duration-300 ${
            isValid
              ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          {isRegisteringUser ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default CustomerSignupForm;
