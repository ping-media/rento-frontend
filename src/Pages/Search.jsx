import SearchRide from "../components/SearchRide/SearchRide";
import Filters from "../components/Filters/Filters";
import Card from "../components/ProductCard/Card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductSkeleton from "../components/skeleton/ProductSkeleton";
import ErrorNotFound from "../components/Error/ErrorNotFound";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { formatDateTimeForUser, handlePreviousPage } from "../utils";
import {
  toggleFilter,
  toggleSearchUpdate,
} from "../Redux/ModalSlice/ModalSlice";
import { handleSearchVehicleData } from "../Data/Functions";

const Search = () => {
  const navigate = useNavigate();
  const [queryParms] = useSearchParams();
  const [queryParmsData] = useState(Object.fromEntries(queryParms.entries()));
  const dispatch = useDispatch();
  const { loading, vehicles } = useSelector((state) => state.vehicles);
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  const { isFilterActive } = useSelector((state) => state.modals);
  const { id } = useParams();
  //for showing pickup & dropoff date
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropOff] = useState(null);
  const customLocation = useLocation();

  useEffect(() => {
    //this function help to search data
    const newQueryParmsData = Object.fromEntries(queryParms.entries());
    handleSearchVehicleData(
      dispatch,
      newQueryParmsData,
      location,
      selectedLocation,
      id
    );
    // console.log(vehicles);
  }, [customLocation]);

  // picking date from url and convert the data to show date in mobile view
  useEffect(() => {
    const pickUpDateAndTime = queryParmsData?.BookingStartDateAndTime;
    const dropoffDateAndTime = queryParmsData?.BookingEndDateAndTime;
    if (pickUpDateAndTime && dropoffDateAndTime) {
      setPickup(formatDateTimeForUser(pickUpDateAndTime));
      setDropOff(formatDateTimeForUser(dropoffDateAndTime));
    }
  }, []);

  return (
    <>
      {/* search filters  */}
      <SearchRide />
      {/* mobileSearch  */}
      <div className="lg:hidden bg-white shadow-md px-6 py-2 lg:py-3 flex items-center justify-between">
        <button
          className="flex items-center gap-1 p-2 rounded-lg border-2 border-theme bg-theme text-gray-100"
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
        </button>
        <button
          className="px-4 py-2 border-2 border-theme rounded-lg font-semibold"
          type="button"
          onClick={() => dispatch(toggleSearchUpdate())}
        >
          <span>{pickup?.date}</span>
          <span className="mx-1 text-theme">To</span>
          <span>{dropoff?.date}</span>
        </button>
        <button type="button" onClick={() => dispatch(toggleFilter())}>
          <svg
            xmln="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
        </button>
      </div>

      <div className="mt-10 mb-4 w-[90%] mx-auto">
        <div className="grid grid-cols-4 w-full">
          {/* 25% column */}
          <div
            className={`${
              !isFilterActive
                ? "hidden lg:block"
                : "absolute w-full bg-white h-full left-0 top-0 z-20"
            } col-span-1 px-4`}
          >
            <div className="lg:hidden py-2 border-b-2 px-4 flex items-center justify-between">
              <h2 className="text-xl uppercase font-bold">
                Filter<span className="text-theme">s</span>
              </h2>
              <button type="button" onClick={() => dispatch(toggleFilter())}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="px-4 py-2.5 lg:bg-white lg:shadow-xl lg:rounded-lg">
              <Filters />
            </div>
          </div>

          {/* 75% column */}
          <div className="col-span-4 lg:col-span-3 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {!loading ? (
                vehicles?.length > 0 ? (
                  vehicles?.map((item, index) => <Card {...item} key={index} />)
                ) : (
                  <div className="col-span-3">
                    <ErrorNotFound errorMessage={"No Vehicles Found."} />
                  </div>
                )
              ) : (
                new Array(3)
                  .fill(undefined)
                  .map((_, index) => <ProductSkeleton key={index} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
