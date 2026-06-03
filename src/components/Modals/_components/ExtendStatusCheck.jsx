import { useState } from "react";
import { fetchingData, handlePostData } from "../../../Data";
import { useDispatch } from "react-redux";
import { handleAsyncError } from "../../../utils/handleAsyncError";
import { updateRidesData } from "../../../Redux/RidesSlice/RideSlice";
import Spinner from "../../Spinner/Spinner";

const ExtendStatusCheck = ({ rides, handleCloseModal }) => {
  const [retryLoading, setRetryLoading] = useState(false);
  const dispatch = useDispatch();
  const isExtended =
    (rides[0]?.bookingPrice?.extendAmount?.length || 0) > 0 || false;

  const handleCheckAndUpdate = async () => {
    try {
      setRetryLoading(true);
      const res = await handlePostData("/check-extend-status", {
        booking_id: rides[0]?._id,
      });
      if (res?.success) {
        if (res?.canRetry) {
          // re-fetch booking to update redux so isDisabled recalculates
          const updated = await fetchingData(
            `/getBookings?_id=${rides[0]?._id}`,
          );
          if (updated?.data) dispatch(updateRidesData(updated.data));
          handleAsyncError(dispatch, res.message, "success");
        } else {
          // was actually paid — also refresh
          const updated = await fetchingData(
            `/getBookings?_id=${rides[0]?._id}`,
          );
          if (updated?.data) dispatch(updateRidesData(updated.data));
          handleAsyncError(dispatch, res.message, "success");
          handleCloseModal();
        }
      } else {
        handleAsyncError(dispatch, res?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setRetryLoading(false);
    }
  };

  return (
    <div className="text-left text-xs lg:text-sm text-theme italic mb-2 flex flex-wrap md:flex-nowrap items-center justify-between">
      <p>
        <span className="font-bold mr-1">Note:</span>
        {isExtended
          ? "A pending payment was found. Click below to check its status and retry."
          : "Main booking payment is pending."}
      </p>

      {isExtended && (
        <button
          type="button"
          disabled={retryLoading}
          onClick={handleCheckAndUpdate}
          className="w-2/6 mt-2 md:mt-0 text-white bg-theme px-3 py-1.5 rounded-md text-xs disabled:bg-theme/60"
        >
          {retryLoading ? <Spinner message="Checking..." /> : "Check Status"}
        </button>
      )}
    </div>
  );
};

export default ExtendStatusCheck;
