import { useLocation } from "react-router-dom";
import { isHomeLink } from "../../Data/dummyData";

const SearchBarSkeleton = () => {
  const location = useLocation();

  return (
    <div
      className={`w-[95%] ${
        location.pathname === "/monthly-rental" ? "lg:w-[75%]" : "lg:w-[90%]"
      } mx-auto px-4 py-2.5 lg:px-6 lg:py-3 bg-white lg:rounded-lg ${
        isHomeLink.includes(location.pathname) && "-mt-8 md:-mt-28 lg:-mt-14"
      } shadow-lg ${
        !isHomeLink.includes(location.pathname)
          ? isSearchUpdatesActive
            ? "fixed w-full top-0 h-full z-50"
            : "relative hidden lg:block"
          : "relative rounded-lg z-10"
      }`}
      //  className="w-full bg-white rounded-xl shadow-md p-4 animate-pulse"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Pickup Location */}
        <div className="flex-1 w-full animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-12 bg-gray-200 rounded-lg" />
        </div>

        {/* Pickup Date & Time */}
        <div className="flex-1 w-full animate-pulse">
          <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-12 bg-gray-200 rounded-lg" />
        </div>

        {/* Drop-off Date & Time */}
        <div className="flex-1 w-full animate-pulse">
          <div className="h-4 w-44 bg-gray-200 rounded mb-2" />
          <div className="h-12 bg-gray-200 rounded-lg" />
        </div>

        {/* Find Button */}
        <div className="w-full lg:w-40 mt-4 lg:mt-6 animate-pulse">
          <div className="h-12 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SearchBarSkeleton;
