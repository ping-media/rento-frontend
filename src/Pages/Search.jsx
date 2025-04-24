import SearchRide from "../components/SearchRide/SearchRide";
import Filters from "../components/Filters/Filters";
import Card from "../components/ProductCard/Card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductSkeleton from "../components/skeleton/ProductSkeleton";
import ErrorNotFound from "../components/Error/ErrorNotFound";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { toggleFilter } from "../Redux/ModalSlice/ModalSlice";
import { handleSearchVehicleData } from "../Data/Functions";
import { removeTempDate } from "../Redux/ProductSlice/ProductsSlice";
import { removeTempBookingData } from "../Redux/BookingSlice/BookingSlice";
import Pagination from "../components/SearchRide/Pagination";

const Search = () => {
  const [queryParms] = useSearchParams();
  const dispatch = useDispatch();
  const { loading, vehicles, pagination } = useSelector(
    (state) => state.vehicles
  );
  const [currentPage, setCurrentPage] = useState(pagination?.page);
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  const { selectedStation } = useSelector((state) => state.station);
  const { isFilterActive } = useSelector((state) => state.modals);
  const { id } = useParams();
  const customLocation = useLocation();

  useEffect(() => {
    if (!id) return;
    const newQueryParmsData = Object.fromEntries(queryParms.entries());
    //search data
    handleSearchVehicleData(
      dispatch,
      newQueryParmsData,
      location,
      selectedLocation,
      selectedStation?.stationId || id,
      pagination?.page
    );
  }, [customLocation.search, pagination?.page, selectedStation]);

  //removing this after we are going to booking
  useEffect(() => {
    dispatch(removeTempDate());
    dispatch(removeTempBookingData());
  }, []);

  return (
    <>
      {/* search filters  */}
      <SearchRide />
      <div className="mt-5 lg:mt-10 mb-4 w-[95%] lg:w-[90%] mx-auto">
        <div className="grid grid-cols-4 w-full">
          {/* 25% column */}
          <div
            className={`${
              !isFilterActive
                ? "hidden lg:block"
                : "fixed w-full bg-white h-full left-0 top-0 z-20"
            } col-span-1 px-2 lg:px-4`}
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
          <div className="col-span-4 lg:col-span-3 px-1">
            {!loading ? (
              <h3 className="mb-3 font-bold text-lg text-right">
                {pagination?.totalRecords || 0} Vehicles Found
              </h3>
            ) : (
              <div className="mb-3 ml-auto font-bold text-lg bg-gray-400/50 rounded animate-pulse w-20 h-5"></div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {!loading ? (
                Object.entries(vehicles)?.length > 0 ? (
                  <>
                    {vehicles?.availableVehicles?.map((item, index) => (
                      <Card {...item} key={index} />
                    ))}
                    {vehicles?.excludedVehicles?.map((item, index) => (
                      <Card {...item} isSold={true} key={index} />
                    ))}
                  </>
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
            {pagination?.totalPages > 1 && (
              <div className="flex w-full items-center justify-end mt-5">
                <Pagination
                  totalNumberOfPages={pagination?.totalPages}
                  currentPage={currentPage}
                  setPageChanger={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
