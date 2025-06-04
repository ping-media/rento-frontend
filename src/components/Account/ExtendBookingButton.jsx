import { useDispatch, useSelector } from "react-redux";
import { toggleBookingExtendModal } from "../../Redux/ModalSlice/ModalSlice";

const ExtendBookingButton = () => {
  const { rides } = useSelector((state) => state.rides);
  const dispatch = useDispatch();

  const isDisabled =
    (rides?.length > 0 &&
      ["refunded", "completed", "canceled"].includes(
        rides[0]?.paymentStatus
      )) ||
    false;

  return (
    <button
      type="button"
      className="w-full px-4 py-2 bg-theme/90 text-white rounded-md shadow-md hover:bg-theme-dark transition-all duration-300 ease-in-out uppercase font-semibold tracking-wider disabled:bg-gray-600/50"
      onClick={() => dispatch(toggleBookingExtendModal())}
      disabled={isDisabled}
    >
      Extend Ride
    </button>
  );
};

export default ExtendBookingButton;
