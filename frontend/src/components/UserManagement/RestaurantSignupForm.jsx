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
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUtensils,
  FaMapMarkerAlt,
  FaIdBadge,
  FaListAlt,
  FaClock,
  FaUniversity,
  FaHashtag,
} from "react-icons/fa";
import { GiChefToque, GiKnifeFork, GiCookingPot } from "react-icons/gi";

const RestaurantSignupForm = () => {
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
    setOpeningHours((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBankDetailsChange = (e, field) => {
    setBankDetails((prev) => ({ ...prev, [field]: e.target.value }));
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
      navigate("/login");
    } else {
      showToast("error", result.error.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 via-green-50 to-green-100 ml-64 font-[Quicksand]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl p-10 space-y-8 bg-white/90 rounded-3xl shadow-2xl border-2 border-green-200"
        style={{ fontFamily: "Quicksand, Poppins, Montserrat, sans-serif" }}
      >
        <h2 className="mb-6 text-4xl font-extrabold text-center text-green-700 flex items-center justify-center gap-3">
          <GiChefToque className="text-5xl text-green-500" /> Restaurant Signup
        </h2>

        {/* Username & Email */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Username */}
          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaUser className="text-green-500" /> Username *
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
                value={username}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
                placeholder="Enter username"
              />
            </div>
            {usernameHasError && (
              <p className="mt-1 text-sm text-red-500">Username is required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaEnvelope className="text-green-500" /> Email *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Enter email"
              />
            </div>
            {emailHasError && (
              <p className="mt-1 text-sm text-red-500">Enter a valid email</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaLock className="text-green-500" /> Password *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="Enter password"
              />
            </div>
            {passwordHasError && (
              <p className="mt-1 text-sm text-red-500">
                Strong password required
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaLock className="text-green-500" /> Confirm Password *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
                placeholder="Re-enter password"
              />
            </div>
            {confirmPasswordHasError && (
              <p className="mt-1 text-sm text-red-500">Passwords must match</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaPhone className="text-green-500" /> Phone Number *
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                onBlur={handlePhoneNumberBlur}
                placeholder="Enter phone number"
              />
            </div>
            {phoneNumberHasError && (
              <p className="mt-1 text-sm text-red-500">
                Valid phone number required
              </p>
            )}
          </div>
        </div>

        {/* Restaurant Info */}
        <hr className="border-gray-300" />
        <h3 className="mb-2 text-2xl font-bold text-green-700 flex items-center gap-2">
          <GiKnifeFork className="text-3xl text-green-500" /> Restaurant
          Information
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaUtensils className="text-green-500" /> Restaurant Name *
            </label>
            <div className="relative">
              <FaUtensils className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                placeholder="Restaurant Name"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-2"
                value={restaurantName}
                onChange={handleRestaurantNameChange}
                onBlur={handleRestaurantNameBlur}
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-500" /> Location *
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                placeholder="Location"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-2"
                value={location}
                onChange={handleLocationChange}
                onBlur={handleLocationBlur}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaIdBadge className="text-green-500" /> Business License Number *
            </label>
            <div className="relative">
              <FaIdBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                placeholder="Business License Number"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-2"
                value={businessLicenseNumber}
                onChange={handleBusinessLicenseNumberChange}
                onBlur={handleBusinessLicenseNumberBlur}
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaListAlt className="text-green-500" /> Cuisine Type *
            </label>
            <div className="relative">
              <FaListAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <select
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-2"
                value={cuisineType}
                onChange={handleCuisineTypeChange}
                onBlur={handleCuisineTypeBlur}
              >
                <option value="">Select Cuisine Type</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Indian">Indian</option>
                <option value="Mexican">Mexican</option>
                <option value="Japanese">Japanese</option>
                <option value="Thai">Thai</option>
                <option value="American">American</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="French">French</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <hr className="border-gray-300" />
        <h3 className="mb-2 text-2xl font-bold text-green-700 flex items-center gap-2">
          <FaClock className="text-3xl text-green-500" /> Opening Hours
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="time"
              placeholder="Start Time"
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
              value={openingHours.start}
              onChange={(e) => handleOpeningHoursChange(e, "start")}
            />
          </div>
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="time"
              placeholder="End Time"
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
              value={openingHours.end}
              onChange={(e) => handleOpeningHoursChange(e, "end")}
            />
          </div>
        </div>

        {/* Bank Details */}
        <hr className="border-gray-300" />
        <h3 className="mb-2 text-2xl font-bold text-green-700 flex items-center gap-2">
          <FaUniversity className="text-3xl text-green-500" /> Bank Details
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaHashtag className="text-green-500" /> Account Number *
            </label>
            <div className="relative">
              <FaHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                placeholder="Account Number"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-2"
                value={bankDetails.accountNumber}
                onChange={(e) => handleBankDetailsChange(e, "accountNumber")}
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
              <FaUniversity className="text-green-500" /> Bank Name *
            </label>
            <div className="relative">
              <FaUniversity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                placeholder="Bank Name"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-2"
                value={bankDetails.bankName}
                onChange={(e) => handleBankDetailsChange(e, "bankName")}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-2 text-lg font-semibold flex items-center gap-2">
            <FaHashtag className="text-green-500" /> Branch Code *
          </label>
          <div className="relative">
            <FaHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              placeholder="Branch Code"
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-4"
              value={bankDetails.branchCode}
              onChange={(e) => handleBankDetailsChange(e, "branchCode")}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 text-xl font-bold rounded-xl transition-colors duration-300 shadow-lg flex items-center justify-center gap-2 ${
            isValid
              ? "bg-gradient-to-r from-green-400 via-green-900 to-green-500 hover:from-green-900 hover:to-green-600 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <GiCookingPot className="text-2xl" />
          {isRegisteringUser ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantSignupForm;
