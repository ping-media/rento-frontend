import { useSelector } from "react-redux";

const BookingSuccessModal = () => {
  const { isBookingDone } = useSelector((state) => state.modals);
  return (
    <div
      className={`fixed ${
        !isBookingDone ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-5 lg:top-60 mx-auto shadow-xl rounded-xl bg-white max-w-lg">
        <div className="p-4 pt-5 text-center">
          {/* <div className="w-full p-4 shadow-2xl"> */}
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
              <svg
                className="h-10 w-10 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                ></path>
              </svg>
            </div>
            <h1 className="text-xl lg:text-3xl font-extrabold text-green-700">
              Booking Successful!
            </h1>
            <p className="mt-2 lg:mt-3 text-sm lg:text-sm text-gray-800 mb-4">
              Thank you for booking ride with us.
            </p>
            {/* <p class="mt-4 text-xs lg:text-sm text-gray-400 italic">
              Redirecting into 10 seconds
            </p> */}
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
