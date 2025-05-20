import React from "react";
import { useInput } from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";
import { useThunk } from "../../hooks/use-thunk";
import { loginUser } from "../../store/thunks/userThunks";
import showToast from "../../utils/toastNotifications";
import { isEmail, isNotEmpty } from "../../utils/Validation";

const LoginForm = () => {
  const navigate = useNavigate();
  const [doLoginUser, isLoggingIn] = useThunk(loginUser);

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
  } = useInput("", isNotEmpty);

  const isValid = email && !emailHasError && password && !passwordHasError;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      showToast("error", "Please fix validation errors before logging in");
      return;
    }

    try {
      const payload = {
        email: email.toLowerCase(),
        password,
      };

      const result = await doLoginUser(payload);

      if (result.success) {
        const { token, user } = result.response.data; // 🆕 correct extraction
        const userId = user._id;
        const role = user.role;
        const email = user.email;
        const phone = user.phone;
        const firstName = user.username;
        const lastname = user.username;

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userPhone", user.phone);
        localStorage.setItem("userFirstName", user.username);
        localStorage.setItem("userLastName", user.username);

        showToast("success", "Login successful!");

        // Redirect based on role
        if (role === "Customer") {
          navigate("/");
        } else if (role === "DeliveryPerson") {
          navigate("/driver/available-deliveries");
        } else if (role === "Restaurant") {
          navigate("/restaurant/profile");
        } else {
          navigate("/");
        }
      } else {
        const errorMsg = result.error?.message || "";

        if (errorMsg.includes("No account found with this email")) {
          showToast("error", "No account exists with this email address");
        } else if (errorMsg.includes("Incorrect password")) {
          showToast("error", "Incorrect password, please try again");
        } else {
          showToast("error", "Login failed. Please check your credentials");
        }
      }
    } catch (error) {
      console.error(error);
      showToast("error", "An unexpected error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-800 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="mb-4 text-2xl font-bold text-center text-green-600">
          Login to YumGo
        </h2>

        <div>
          <label className="block mb-1 text-sm font-semibold">Email *</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="Enter your email"
          />
          {emailHasError && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a valid email
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold">Password *</label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            placeholder="Enter your password"
          />
          {passwordHasError && (
            <p className="mt-1 text-sm text-red-500">
              Password cannot be empty
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 font-bold rounded-md transition-colors duration-300 ${
            isValid
              ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
