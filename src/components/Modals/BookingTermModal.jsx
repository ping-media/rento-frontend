import { useDispatch, useSelector } from "react-redux";
import { toggleBookingTermModal } from "../../Redux/ModalSlice/ModalSlice";
import { bookingTermsList } from "../../Data/dummyData";

const BookingTermModal = () => {
  const dispatch = useDispatch();
  const { isBookingTermActive } = useSelector((state) => state.modals);

  if (!isBookingTermActive) return;

  return (
    <>
      <div
        className={`fixed ${
          !isBookingTermActive && "hidden"
        } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
      >
        <div className="relative top-20 mx-auto shadow-xl rounded bg-white max-w-md">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="font-bold text-xl uppercase">
              Terms And Conditions
            </h2>
            <button
              onClick={() => dispatch(toggleBookingTermModal())}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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

          <div className="p-6 pt-2 text-center">
            <ul className="leading-6 list-disc">
              {bookingTermsList.map((term, index) => (
                <li key={index} className="text-left">
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingTermModal;
