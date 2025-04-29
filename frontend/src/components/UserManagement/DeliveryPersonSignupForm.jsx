import React, { useState } from "react";
import { useInput } from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";
import { useThunk } from "../../hooks/use-thunk";
import { registerUser } from "../../store/thunks/userThunks";
import showToast from "../../utils/toastNotifications";
import { isEmail, isNotEmpty, isPasswordStrong, isPasswordsMatch, isValidNumber } from "../../utils/Validation";

const DeliveryPersonSignupForm = () => {
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
  const { value: nic, handleInputChange: handleNICChange, handleInputBlur: handleNICBlur, hasError: nicHasError } = useInput("", isNotEmpty);

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
    <div className='flex items-center justify-center min-h-screen text-gray-800 bg-gray-100'>
      <form onSubmit={handleSubmit} className='w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-lg'>
        <h2 className='mb-4 text-2xl font-bold text-center text-green-600'>Delivery Person Signup</h2>

        {/* Credentials */}
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
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

        {/* Personal Info */}
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

        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <div>
            <label className='block mb-1 text-sm font-semibold'>Vehicle Type *</label>
            <input
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              value={vehicleType}
              onChange={handleVehicleTypeChange}
              onBlur={handleVehicleTypeBlur}
              placeholder='e.g., Bike, Car'
            />
            {vehicleTypeHasError && <p className='mt-1 text-sm text-red-500'>Vehicle type required</p>}
          </div>

          <div>
            <label className='block mb-1 text-sm font-semibold'>License Number *</label>
            <input
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              value={licenseNumber}
              onChange={handleLicenseNumberChange}
              onBlur={handleLicenseNumberBlur}
              placeholder='Enter license number'
            />
            {licenseNumberHasError && <p className='mt-1 text-sm text-red-500'>License number required</p>}
          </div>
        </div>

        <div>
          <label className='block mb-1 text-sm font-semibold'>NIC *</label>
          <input
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            value={nic}
            onChange={handleNICChange}
            onBlur={handleNICBlur}
            placeholder='Enter NIC'
          />
          {nicHasError && <p className='mt-1 text-sm text-red-500'>NIC required</p>}
        </div>

        <button
          type='submit'
          disabled={!isValid}
          className={`w-full mt-6 py-3 font-bold rounded-md transition-colors duration-300 ${
            isValid ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer" : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}>
          {isRegisteringUser ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default DeliveryPersonSignupForm;
