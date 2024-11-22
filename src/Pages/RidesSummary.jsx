import { useNavigate } from "react-router-dom";
import { handlePreviousPage } from "../utils";
import RideCard from "../components/Account/RideCard";
import LocationCard from "../components/ProductCard/LocationCard";

const RidesSummary = () => {
  const navigate = useNavigate();
  return (
    <div className="border-2 rounded-lg px-4 py-2 shadow-md bg-white mb-3">
      <div className="mb-1 flex items-center gap-3">
        <button
          className="flex lg:hidden items-center gap-1 p-2 rounded-lg border-2 border-theme bg-theme text-gray-100"
          type="button"
          onClick={() => handlePreviousPage(navigate)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H6M12 5l-7 7 7 7" />
          </svg>
          <span className="text-sm">Back</span>
        </button>
        <h2 className="font-semibold text-xl uppercase py-2">
          Booking <span className="text-theme">Information</span>
        </h2>
      </div>
      <div className="px-4 py-3.5 -mx-4 bg-lighter-gray flex items-center justify-between mb-5 text-sm">
        <div className="flex items-center">
          <p className="font-semibold w-full lg:w-auto text-gray-600">
            <span className="block lg:inline">Booking Id: #435678</span>
            <span className="mx-1 hidden lg:inline">|</span>
            BookingDate: 12 Nov, 2024 06:39 PM
          </p>
        </div>
        <button
          type="button"
          className="bg-theme text-gray-100 p-1 lg:px-4 lg:py-2.5 border rounded-md hover:bg-theme-dark"
        >
          Booking Status: Confirmed
        </button>
      </div>
      <div className="lg:overflow-hidden lg:hover:overflow-y-auto lg:max-h-96 no-scrollbar">
        <div className="mb-5">
          <h2 className="font-semibold mb-3 flex items-center gap-1">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </span>
            Vehicle Details
          </h2>
          <RideCard />
        </div>
        <div className="mb-5">
          <h2 className="font-semibold mb-3 flex items-center gap-1">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
              </svg>
            </span>
            Station Details
          </h2>
          <LocationCard />
        </div>
        <div className="mb-5">
          <h2 className="font-semibold mb-3 flex items-center gap-1">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                />
              </svg>
            </span>
            Fare Details
          </h2>
          <RideCard />
        </div>
        <div>
          <button className="w-full bg-theme text-gray-100 px-4 py-2.5 rounded-md">
            Extend
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidesSummary;
