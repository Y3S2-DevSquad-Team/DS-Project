import React, { useState } from "react";
import { useInput } from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";
import { useThunk } from "../../hooks/use-thunk";
import { registerUser } from "../../store/thunks/userThunks";
import showToast from "../../utils/toastNotifications";
import { isEmail, isNotEmpty, isPasswordStrong, isPasswordsMatch, isValidNumber } from "../../utils/Validation";

const RestaurantSignupForm = () => {
  const navigate = useNavigate();
  const [doRegisterUser, isRegisteringUser] = useThunk(registerUser);

  const {
    value: username,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
  } = useInput("", isNotEmpty);
  const { value: email, handleInputChange: handleEmailChange, handleInputBlur: handleEmailBlur, hasError: emailHasError } = useInput("", isEmail);
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
  const [bankDetails, setBankDetails] = useState({ accountNumber: "", bankName: "", branchCode: "" });

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
    <div className='flex items-center justify-center min-h-screen text-gray-800 bg-gray-100'>
      <form onSubmit={handleSubmit} className='w-full max-w-3xl p-8 space-y-6 bg-white rounded-lg shadow-lg'>
        <h2 className='mb-4 text-2xl font-bold text-center text-green-600'>Restaurant Signup</h2>

        {/* Username & Email */}
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          {/* Username */}
          <div>
            <label className='block mb-1 text-sm font-semibold'>Username *</label>
            <input
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              placeholder='Enter username'
            />
            {usernameHasError && <p className='mt-1 text-sm text-red-500'>Username is required</p>}
          </div>

          {/* Email */}
          <div>
            <label className='block mb-1 text-sm font-semibold'>Email *</label>
            <input
              type='email'
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder='Enter email'
            />
            {emailHasError && <p className='mt-1 text-sm text-red-500'>Enter a valid email</p>}
          </div>
        </div>

        {/* Password */}
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <div>
            <label className='block mb-1 text-sm font-semibold'>Password *</label>
            <input
              type='password'
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              placeholder='Enter password'
            />
            {passwordHasError && <p className='mt-1 text-sm text-red-500'>Strong password required</p>}
          </div>

          <div>
            <label className='block mb-1 text-sm font-semibold'>Confirm Password *</label>
            <input
              type='password'
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              placeholder='Re-enter password'
            />
            {confirmPasswordHasError && <p className='mt-1 text-sm text-red-500'>Passwords must match</p>}
          </div>
        </div>

        {/* Phone */}
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <div>
            <label className='block mb-1 text-sm font-semibold'>Country Code *</label>
            <select
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              value={dialCode}
              onChange={(e) => setDialCode(e.target.value)}>
              <option value='+94'>🇱🇰 +94 (Sri Lanka)</option>
              <option value='+1'>🇺🇸 +1 (USA)</option>
              <option value='+44'>🇬🇧 +44 (UK)</option>
              <option value='+61'>🇦🇺 +61 (Australia)</option>
            </select>
          </div>

          <div>
            <label className='block mb-1 text-sm font-semibold'>Phone Number *</label>
            <input
              type='text'
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onBlur={handlePhoneNumberBlur}
              placeholder='Enter phone number'
            />
            {phoneNumberHasError && <p className='mt-1 text-sm text-red-500'>Valid phone number required</p>}
          </div>
        </div>

        {/* Restaurant Info */}
        <hr className='border-gray-300' />
        <h3 className='mb-2 text-lg font-bold text-green-600'>Restaurant Information</h3>

        <input
          placeholder='Restaurant Name'
          className='w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
          value={restaurantName}
          onChange={handleRestaurantNameChange}
          onBlur={handleRestaurantNameBlur}
        />

        <input
          placeholder='Location'
          className='w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
          value={location}
          onChange={handleLocationChange}
          onBlur={handleLocationBlur}
        />

        <input
          placeholder='Business License Number'
          className='w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
          value={businessLicenseNumber}
          onChange={handleBusinessLicenseNumberChange}
          onBlur={handleBusinessLicenseNumberBlur}
        />

        <input
          placeholder='Cuisine Type'
          className='w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
          value={cuisineType}
          onChange={handleCuisineTypeChange}
          onBlur={handleCuisineTypeBlur}
        />

        {/* Opening Hours */}
        <hr className='border-gray-300' />
        <h3 className='mb-2 text-lg font-bold text-green-600'>Opening Hours</h3>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <input
            type='time'
            placeholder='Start Time'
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            value={openingHours.start}
            onChange={(e) => handleOpeningHoursChange(e, "start")}
          />
          <input
            type='time'
            placeholder='End Time'
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            value={openingHours.end}
            onChange={(e) => handleOpeningHoursChange(e, "end")}
          />
        </div>

        {/* Bank Details */}
        <hr className='border-gray-300' />
        <h3 className='mb-2 text-lg font-bold text-green-600'>Bank Details</h3>

        <input
          placeholder='Account Number'
          className='w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
          value={bankDetails.accountNumber}
          onChange={(e) => handleBankDetailsChange(e, "accountNumber")}
        />

        <input
          placeholder='Bank Name'
          className='w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
          value={bankDetails.bankName}
          onChange={(e) => handleBankDetailsChange(e, "bankName")}
        />

        <input
          placeholder='Branch Code'
          className='w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
          value={bankDetails.branchCode}
          onChange={(e) => handleBankDetailsChange(e, "branchCode")}
        />

        {/* Submit */}
        <button
          type='submit'
          disabled={!isValid}
          className={`w-full py-3 font-bold rounded-md transition-colors duration-300 ${
            isValid ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer" : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}>
          {isRegisteringUser ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantSignupForm;
