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
  FaIdCard,
  FaMotorcycle,
  FaIdBadge,
} from "react-icons/fa";

const FormField = ({ label, icon, inputProps, error, options }) => {
  return (
    <div>
      <label className="block mb-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      {options ? (
        <select
          {...inputProps}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select vehicle type</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...inputProps}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

const DeliveryPersonSignupForm = () => {
  const navigate = useNavigate();
  const [doRegisterUser, isRegisteringUser] = useThunk(registerUser);

  const usernameField = useInput("", isNotEmpty);
  const emailField = useInput("", isEmail);
  const passwordField = useInput("", isPasswordStrong);
  const confirmPasswordField = useInput("", (v) =>
    isPasswordsMatch(passwordField.value, v)
  );
  const phoneField = useInput("", isValidNumber);
  const vehicleTypeField = useInput("", isNotEmpty);
  const licenseNumberField = useInput("", isNotEmpty);
  const nicField = useInput("", isNotEmpty);
  const [dialCode, setDialCode] = useState("+94");

  const isValid = [
    usernameField,
    emailField,
    passwordField,
    confirmPasswordField,
    phoneField,
    vehicleTypeField,
    licenseNumberField,
    nicField,
  ].every((field) => field.value && !field.hasError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      showToast("error", "Please fix validation errors before submitting");
      return;
    }

    const payload = {
      username: usernameField.value,
      email: emailField.value,
      password: passwordField.value,
      phone: `${dialCode}${phoneField.value}`,
      vehicleType: vehicleTypeField.value,
      licenseNumber: licenseNumberField.value,
      nic: nicField.value,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4 py-16 ml-64">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-green-600 text-white p-10 hidden md:flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">Join as a Rider</h2>
          <p className="text-sm">
            Become a part of the YumGo delivery fleet. Earn while ensuring fast
            and safe deliveries!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <h2 className="text-2xl font-bold text-green-700 text-center">
            Delivery Signup
          </h2>

          <div className="grid grid-cols-1 gap-5">
            <FormField
              label="Username *"
              icon={<FaUser />}
              inputProps={{
                value: usernameField.value,
                onChange: usernameField.handleInputChange,
                onBlur: usernameField.handleInputBlur,
                placeholder: "Username",
              }}
              error={usernameField.hasError && "Username is required"}
            />
            <FormField
              label="Email *"
              icon={<FaEnvelope />}
              inputProps={{
                type: "email",
                value: emailField.value,
                onChange: emailField.handleInputChange,
                onBlur: emailField.handleInputBlur,
                placeholder: "Email",
              }}
              error={emailField.hasError && "Enter valid email"}
            />
            <FormField
              label="Password *"
              icon={<FaLock />}
              inputProps={{
                type: "password",
                value: passwordField.value,
                onChange: passwordField.handleInputChange,
                onBlur: passwordField.handleInputBlur,
                placeholder: "Password",
              }}
              error={passwordField.hasError && "Strong password required"}
            />
            <FormField
              label="Confirm Password *"
              icon={<FaLock />}
              inputProps={{
                type: "password",
                value: confirmPasswordField.value,
                onChange: confirmPasswordField.handleInputChange,
                onBlur: confirmPasswordField.handleInputBlur,
                placeholder: "Confirm password",
              }}
              error={confirmPasswordField.hasError && "Passwords do not match"}
            />
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Country Code *
              </label>
              <select
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              >
                <option value="+94">🇱🇰 +94 (Sri Lanka)</option>
                <option value="+1">🇺🇸 +1 (USA)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+61">🇦🇺 +61 (Australia)</option>
              </select>
            </div>
            <FormField
              label="Phone *"
              icon={<FaPhone />}
              inputProps={{
                value: phoneField.value,
                onChange: phoneField.handleInputChange,
                onBlur: phoneField.handleInputBlur,
                placeholder: "Phone number",
              }}
              error={phoneField.hasError && "Valid phone number required"}
            />
            <FormField
              label="Vehicle Type *"
              icon={<FaMotorcycle />}
              inputProps={{
                value: vehicleTypeField.value,
                onChange: vehicleTypeField.handleInputChange,
                onBlur: vehicleTypeField.handleInputBlur,
              }}
              options={["Bike", "Car", "Van", "Tuk-Tuk"]}
              error={vehicleTypeField.hasError && "Vehicle type required"}
            />
            <FormField
              label="License Number *"
              icon={<FaIdCard />}
              inputProps={{
                value: licenseNumberField.value,
                onChange: licenseNumberField.handleInputChange,
                onBlur: licenseNumberField.handleInputBlur,
                placeholder: "License Number",
              }}
              error={licenseNumberField.hasError && "Required"}
            />
            <FormField
              label="NIC *"
              icon={<FaIdBadge />}
              inputProps={{
                value: nicField.value,
                onChange: nicField.handleInputChange,
                onBlur: nicField.handleInputBlur,
                placeholder: "NIC",
              }}
              error={nicField.hasError && "NIC required"}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 text-white font-bold rounded-xl text-lg tracking-wide transition-all duration-300 ${
              isValid
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isRegisteringUser ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryPersonSignupForm;
