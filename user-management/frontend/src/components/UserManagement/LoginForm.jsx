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

  // Inputs with validation
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
        showToast("success", "Login successful!");

        const role = result.response.data.user.role;
        if (role === "Customer") {
          navigate("/customer/profile");
        } else if (role === "DeliveryPerson") {
          navigate("/delivery-person/profile");
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
    <div className="p-6 bg-[#121212] text-white w-full h-full flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-[#06C167] text-center">
          Login to YumGo
        </h2>

        <div>
          <label>Email *</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="Enter your email"
          />
          {emailHasError && (
            <p className="text-red-500 text-sm">Please enter a valid email</p>
          )}
        </div>

        <div>
          <label>Password *</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            placeholder="Enter your password"
          />
          {passwordHasError && (
            <p className="text-red-500 text-sm">Password cannot be empty</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 font-bold rounded-md transition-colors duration-300 ${
            isValid
              ? "bg-[#06C167] hover:bg-[#04894e] text-black cursor-pointer"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
