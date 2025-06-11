import { setError } from "../Redux/ErrorSlice/ErrorSlice.js";

export const handleAsyncError = (dispatch, error, type) => {
  if (typeof dispatch !== "function") {
    console.error("handleAsyncError: dispatch is not a function", dispatch);
    return;
  }

  dispatch(
    setError({
      message: error || "An error occurred! Try again",
      type: type || "error",
    })
  );
};
