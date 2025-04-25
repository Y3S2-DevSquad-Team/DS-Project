import { DEFAULT_ERROR, ERROR_CODES } from "../constants/constants";

export function validateError(err, navigate) {
  const errorCode = err.code || DEFAULT_ERROR.code;

  if (!ERROR_CODES[errorCode]) {
    navigate("/500");
    return {
      code: DEFAULT_ERROR.code,
      message: DEFAULT_ERROR.message,
    };
  }

  const errorMessage =
    err.message || ERROR_CODES[errorCode] || DEFAULT_ERROR.message;
  return {
    code: errorCode,
    message: errorMessage,
  };
}
