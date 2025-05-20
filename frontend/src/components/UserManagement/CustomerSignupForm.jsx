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

import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome } from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";

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
    <div className="flex justify-center min-h-screen bg-gradient-to-br from-green-200 via-green-50 to-green-100 ml-64 py-10 px-6 font-[Quicksand]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-10 space-y-6 bg-white/90 rounded-3xl shadow-2xl border-2 border-green-200"
        style={{ fontFamily: "Quicksand, Poppins, Montserrat, sans-serif" }}
      >
        <h2 className="text-4xl font-extrabold text-center text-green-700 mb-8 tracking-tight flex items-center justify-center gap-3">
          <GiChefToque className="text-5xl text-green-500" /> Customer Signup
        </h2>

        <div className="space-y-4">
          <FormField
            label="Username"
            icon={<FaUser className="text-green-500" />}
            value={username}
            onChange={handleUsernameChange}
            onBlur={handleUsernameBlur}
            error={usernameHasError && "Username is required"}
            placeholder="Enter username"
          />

          <FormField
            label="Email"
            type="email"
            icon={<FaEnvelope className="text-green-500" />}
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={emailHasError && "Enter a valid email"}
            placeholder="Enter email"
          />

          <FormField
            label="Password"
            type="password"
            icon={<FaLock className="text-green-500" />}
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            error={passwordHasError && "Strong password required"}
            placeholder="Enter password"
          />

          <FormField
            label="Confirm Password"
            type="password"
            icon={<FaLock className="text-green-500" />}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            error={confirmPasswordHasError && "Passwords must match"}
            placeholder="Re-enter password"
          />

          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaPhone className="text-green-500" /> Country Code *
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
              value={dialCode}
              onChange={(e) => setDialCode(e.target.value)}
            >
              <option value="+94">🇱🇰 +94 (Sri Lanka)</option>
              <option value="+1">🇺🇸 +1 (USA)</option>
              <option value="+44">🇬🇧 +44 (UK)</option>
              <option value="+61">🇦🇺 +61 (Australia)</option>
            </select>
          </div>

          <FormField
            label="Phone Number"
            icon={<FaPhone className="text-green-500" />}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            onBlur={handlePhoneNumberBlur}
            error={phoneNumberHasError && "Enter a valid phone number"}
            placeholder="Enter phone number"
          />

          <FormField
            label="Address Label"
            icon={<FaHome className="text-green-500" />}
            value={address.label}
            onChange={(e) => handleAddressChange(e, "label")}
            placeholder="e.g., Home, Office"
          />

          <FormField
            label="Full Address"
            icon={<FaHome className="text-green-500" />}
            value={address.address}
            onChange={(e) => handleAddressChange(e, "address")}
            placeholder="Enter full address"
          />
        </div>

        {addressError && <p className="text-sm text-red-500">{addressError}</p>}

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full mt-6 py-3 text-xl font-bold rounded-xl transition duration-300 shadow-lg flex items-center justify-center gap-2 ${
            isValid
              ? "bg-gradient-to-r from-green-400 via-green-900 to-green-500 hover:from-green-900 hover:to-green-600 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isRegisteringUser ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

const FormField = ({
  label,
  type = "text",
  icon,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}) => (
  <div>
    <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
      {icon} {label} *
    </label>
    <input
      type={type}
      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default CustomerSignupForm;
