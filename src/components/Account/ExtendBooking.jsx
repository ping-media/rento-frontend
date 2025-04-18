import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleBookingExtendModal } from "../../Redux/ModalSlice/ModalSlice";

const ExtendBooking = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(toggleBookingExtendModal());
    };
  }, []);

  return (
    <button
      type="button"
      className="w-full px-4 py-2 bg-theme/90 text-white rounded-md shadow-md hover:bg-theme-dark transition-all duration-300 ease-in-out uppercase font-semibold tracking-wider"
      onClick={() => dispatch(toggleBookingExtendModal())}
    >
      Extend Ride
    </button>
  );
};

export default ExtendBooking;
