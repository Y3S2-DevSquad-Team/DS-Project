import React from "react";
import { useInput } from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";
import { useThunk } from "../../hooks/use-thunk";
import { loginUser } from "../../store/thunks/userThunks";
import showToast from "../../utils/toastNotifications";
import { isEmail, isNotEmpty } from "../../utils/Validation";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 via-green-50 to-green-100 ml-64 font-[Quicksand]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-10 space-y-8 bg-white/90 rounded-3xl shadow-2xl border-2 border-green-200"
        style={{ fontFamily: 'Quicksand, Poppins, Montserrat, sans-serif' }}
      >
        <h2 className="mb-6 text-4xl font-extrabold text-center text-green-700 flex items-center justify-center gap-3">
          <GiChefToque className="text-5xl text-green-500" /> Login to YumGo
        </h2>

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
              placeholder="Enter your email"
            />
          </div>
          {emailHasError && (
            <p className="mt-1 text-sm text-red-500">Please enter a valid email</p>
          )}
        </div>

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
              placeholder="Enter your password"
            />
          </div>
          {passwordHasError && (
            <p className="mt-1 text-sm text-red-500">Password cannot be empty</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 text-xl font-bold rounded-xl transition-colors duration-300 shadow-lg flex items-center justify-center gap-2 ${
            isValid
              ? "bg-gradient-to-r from-green-400 via-green-900 to-green-500 hover:from-green-900 hover:to-green-600 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
