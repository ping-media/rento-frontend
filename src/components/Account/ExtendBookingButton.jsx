import React from "react";
import { useDispatch } from "react-redux";
import { toggleBookingExtendModal } from "../../Redux/ModalSlice/ModalSlice";

const ExtendBookingButton = () => {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className="w-full px-4 py-2 bg-theme/90 text-white rounded-md shadow-md hover:bg-theme-dark transition-all duration-300 ease-in-out uppercase font-semibold tracking-wider disabled:bg-gray-600/50"
      onClick={() => dispatch(toggleBookingExtendModal())}
      // disabled={rides[0]?.BookingEndDateAndTime < new Date().toLocaleString()}
    >
      Extend Ride
    </button>
  );
};

export default ExtendBookingButton;
