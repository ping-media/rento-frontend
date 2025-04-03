import { setError } from "../Redux/ErrorSlice/ErrorSlice.js";

export const handleAsyncError = (dispatch, error, type) => {
  dispatch(
    setError({
      message: error || "An error occured! try again",
      type: type || "error",
    })
  );
};
