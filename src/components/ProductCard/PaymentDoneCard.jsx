import { Link } from "react-router-dom";

const PaymentDoneCard = () => {
  return (
    <div className="w-full max-w-2xl p-4 bg-white shadow-2xl sm:p-10 sm:rounded-2xl mt-10 lg:mt-20">
      <div className="text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
          <svg
            className="h-12 w-12 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            ></path>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-green-700">
          Payment Successful!
        </h1>
        <p className="mt-4 text-lg text-gray-800">
          Thank you for Booking Ride.
        </p>
        <p className="mt-4 text-sm text-gray-700">
          If you have any questions or need further assistance, feel free to
          contact us at:
          <Link
            to={`mailto:support@rentobikes.com`}
            className="font-medium text-indigo-600 underline"
          >
            support@rentobikes.com
          </Link>
        </p>
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-block px-6 py-2 text-lg font-medium text-white transition-transform rounded-full shadow-lg bg-gradient-to-r from-theme to-theme-dark hover:scale-105 hover:from-theme-dark hover:to-theme"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentDoneCard;
