import { useDispatch, useSelector } from "react-redux";
import { toggleBookingTermModal } from "../../Redux/ModalSlice/ModalSlice";
import { useState } from "react";
import TermsAndCondition from "../../Pages/TermsAndCondition";

const BookingTermModal = ({ vehicleBrand, vehicleName, speedLimit }) => {
  const dispatch = useDispatch();
  const { isBookingTermActive } = useSelector((state) => state.modals);
  const [isTermsVisible, setTermVisible] = useState(false);

  if (!isBookingTermActive) return;

  const bookingTermsList = [
    "A Ride cannot commence unless the required documents are uploaded and verified. If the documents are not provided, the booking will be cancelled.",
    `Speed Limit for ${
      vehicleBrand.charAt(0).toUpperCase() + vehicleBrand.slice(1).toLowerCase()
    } ${
      vehicleName.charAt(0).toUpperCase() + vehicleName.slice(1).toLowerCase()
    } is ${speedLimit} kmph or speed limit specified by the governing authority, whichever is lesser.`,
    "Rental package does not include Fuel, Toll, State Permits or Taxes.",
    "km’s included in the booking if exceeded are chargeable at a per km rate.",
    "Some vehicle bookings have a refundable security deposit. Refund of the same, usually takes 3-7 working days, from the date of invoice, to reflect in the source account.",
    <>
      Overspeeding fine is applicable after 3 counts of overspeeding. This is
      exclusive of taxes and any other fines applied by the governing authority.{" "}
      <button
        type="button"
        onClick={() => setTermVisible(!isTermsVisible)}
        className="hover:text-theme hover:underline"
      >
        Read more
      </button>
    </>,
  ];

  return (
    <>
      <div
        className={`fixed ${
          !isBookingTermActive && "hidden"
        } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
      >
        <div className="relative top-10 mx-auto shadow-xl rounded bg-white max-w-xl">
          <div className="flex items-center justify-between px-4 py-2 bg-theme rounded-t text-white">
            <h2 className="font-bold text-xl uppercase">
              Terms And Conditions
            </h2>
            <button
              onClick={() => dispatch(toggleBookingTermModal())}
              type="button"
              className="text-gray-100 bg-transparent hover:bg-white hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div className="p-6 pt-2 text-center overflow-y-scroll max-h-96">
            <ul className="leading-8 list-disc mb-2">
              {bookingTermsList.map((term, index) => (
                <li key={index} className="text-justify text-sm mb-1">
                  {term}
                </li>
              ))}
            </ul>
            <div className={`${isTermsVisible ? "" : "hidden"}`}>
              <TermsAndCondition isModal={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingTermModal;
