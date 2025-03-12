import React, { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "../DatePicker/DatePicker";
import TimePicker from "../TimePicker/TimePicker";
import Button from "../Button/Button";
import DropDownButtonWithIcon from "../DropdownButton/DropDownButtonWithIcon";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchUpdate } from "../../Redux/ModalSlice/ModalSlice";
import {
  addStationData,
  fetchingStation,
} from "../../Redux/StationSlice/StationSlice";
import {
  addDaysToDateForRide,
  convertTo24HourFormat,
  convertToISOString,
  format24HourFormatTime,
  formatDateTimeForUser,
  isMinimumDuration12Hours,
  nextDayFromCurrent,
  removeAfterSecondSlash,
  searchFormatDateOnly,
  searchFormatTimeOnly,
} from "../../utils";
import { searchData } from "../../Data/Functions";
import { handleAsyncError } from "../../utils/handleAsyncError";
import PreLoader from "../skeleton/PreLoader";
import { isHomeLink } from "../../Data/dummyData";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import MobileSearchRide from "./MobileSearchRide";

const SearchRide = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchRideContainerRef = useRef(null);
  const { id } = useParams();
  const { isSearchUpdatesActive } = useSelector((state) => state.modals);
  const { stationLoading, selectedStation } = useSelector(
    (state) => state.station
  );
  const { loading, selectedLocation } = useSelector(
    (state) => state.selectedLocation
  );
  const [isPageLoad, setIsPageLoad] = useState(false);
  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);
  const [pickupDateMobile, setPickupDateMobile] = useState("");
  const [dropoffDateMobile, setDropoffDateMobile] = useState("");
  const [queryParms] = useSearchParams();
  const [queryPickupTime, setQueryPickupTime] = useState("");
  const [queryDropoffTime, setQueryDropoffTime] = useState("");
  const rideSubmitRef = useRef(null);

  // if searchFilter modal is active than run this
  const handletoggleSearchUpdate = () => {
    if (isSearchUpdatesActive) {
      dispatch(toggleSearchUpdate());
    }
  };

  // for searching vehicles
  const handleSearchRide = (e) => {
    e && e.preventDefault();
    const response = new FormData(e.target);
    const result = Object.fromEntries(response.entries());
    const pickupDate = result.pickup.substring(0, 16);
    const pickupTime = result.pickup.substring(17, result.pickup.length);
    let dropoffDate = result?.dropoff?.substring(0, 16) || "";
    const dropoffTime =
      result?.dropoff?.substring(17, result.dropoff.length) || "";

    // changing the drop date when user is coming from monthly page
    if (location.pathname === "/monthly-rental") {
      dropoffDate = addDaysToDateForRide(30, pickupDate);
    }
    const covertedTime = parseInt(
      convertTo24HourFormat(pickupTime).replace(":00", "")
    );
    // checking whether the minimum duration should be 12 hour or more
    const isMinDuration = isMinimumDuration12Hours(
      result.pickup,
      result.dropoff
    );
    // return console.log(result, isMinDuration);
    if (location.pathname !== "/monthly-rental" && !isMinDuration)
      return handleAsyncError(
        dispatch,
        "Minimum Interval between dates should be 12 hours"
      );

    //checking whether time is in opening hours
    try {
      if (
        (location.pathname !== "monthly-rental" &&
          pickupTime === dropoffTime &&
          covertedTime >= selectedStation?.openStartTime &&
          covertedTime <= selectedStation?.openEndTime) ||
        (covertedTime >= selectedStation?.openStartTime &&
          covertedTime <= selectedStation?.openEndTime)
      ) {
        if (
          location.pathname === "/" ||
          removeAfterSecondSlash(location.pathname) === "/search"
        ) {
          if (result?.pickupLocationId !== "") {
            return navigate(
              `/search/${
                result?.pickupLocationId
              }?BookingStartDateAndTime=${convertToISOString(
                pickupDate,
                pickupTime
              )}&BookingEndDateAndTime=${convertToISOString(
                dropoffDate,
                dropoffTime
              )}`
            );
          }
        } else if (location.pathname === "/monthly-rental") {
          return navigate(
            `/search/${
              result?.pickupLocationId
            }?BookingStartDateAndTime=${convertToISOString(
              pickupDate,
              pickupTime
            )}&BookingEndDateAndTime=${convertToISOString(
              dropoffDate,
              pickupTime
            )}`
          );
        } else if (location.pathname === "/explore") {
          return navigate(
            `/explore?BookingStartDateAndTime=${convertToISOString(
              pickupDate,
              pickupTime
            )}&BookingEndDateAndTime=${convertToISOString(
              dropoffDate,
              dropoffTime
            )}`
          );
        }
      } else {
        return handleAsyncError(
          dispatch,
          `Time should be in opening hour ${selectedStation?.openStartTime}:00 - ${selectedStation?.openEndTime}:00`
        );
      }
    } catch (error) {
      navigate(`/error-${error?.message}`);
    }
  };

  // this function is fetching station based on location id
  const memoizedSearchData = useCallback(() => {
    searchData(
      dispatch,
      selectedLocation,
      fetchingStation,
      addStationData,
      loading
    );
  }, [selectedLocation]);

  useEffect(() => {
    memoizedSearchData();
  }, [memoizedSearchData]);

  // this will set time and date for the first time on homepage
  useEffect(() => {
    // Set default dates if data not found
    if (location.pathname === "/") {
      setPickupDate(new Date());
      setDropoffDate(nextDayFromCurrent(new Date()));
      setQueryPickupTime(new Date().toLocaleTimeString());
      setQueryDropoffTime(new Date().toLocaleTimeString());
    }
  }, []);

  //  through this we are changing the dropoffdate && dropOffTime by one for one time only
  useEffect(() => {
    if (pickupDate) {
      setDropoffDate(nextDayFromCurrent(new Date(pickupDate)));
    }
    if (queryPickupTime != "") {
      setQueryDropoffTime(queryPickupTime);
    }
  }, []);

  // changing date & time if time is passed openning hour
  useEffect(() => {
    if (selectedStation != null) {
      const currentTime = new Date().getHours();
      const openEndTime = Number(selectedStation?.openEndTime);
      const openStartTime = Number(selectedStation?.openStartTime);
      // change date & time after end time
      if (currentTime >= openEndTime) {
        const nextday = nextDayFromCurrent(new Date());
        // changing date
        setPickupDate(nextDayFromCurrent(new Date()));
        setDropoffDate(nextDayFromCurrent(nextday));
        // changing time
        setQueryPickupTime(
          format24HourFormatTime(selectedStation?.openStartTime)
        );
        setQueryDropoffTime(
          format24HourFormatTime(selectedStation?.openStartTime)
        );
        // change time to openStartTime if current time does not match
      } else if (currentTime <= openStartTime) {
        setQueryPickupTime(
          format24HourFormatTime(selectedStation?.openStartTime)
        );
        setQueryDropoffTime(
          format24HourFormatTime(selectedStation?.openStartTime)
        );
      }
    }
  }, [selectedStation]);

  useEffect(() => {
    if (!location.pathname.includes("/search/")) return;
    try {
      setIsPageLoad(true);
      const newQueryParmsData = Object.fromEntries(queryParms.entries());
      const pickUpDateAndTime = newQueryParmsData?.BookingStartDateAndTime;
      const dropoffDateAndTime = newQueryParmsData?.BookingEndDateAndTime;
      if (pickUpDateAndTime && dropoffDateAndTime) {
        // for mobile short dates
        setPickupDateMobile(formatDateTimeForUser(pickUpDateAndTime));
        setDropoffDateMobile(formatDateTimeForUser(dropoffDateAndTime));
        // for desktop full view
        setPickupDate(searchFormatDateOnly(pickUpDateAndTime));
        setDropoffDate(searchFormatDateOnly(dropoffDateAndTime));
        setQueryPickupTime(searchFormatTimeOnly(pickUpDateAndTime));
        setQueryDropoffTime(searchFormatTimeOnly(dropoffDateAndTime));
      }
    } catch (error) {
      navigate("/error");
    } finally {
      setIsPageLoad(false);
    }
  }, [location.href]);

  return (
    <>
      {isPageLoad && stationLoading && <PreLoader />}
      <div
        className={`w-[95%] ${
          location.pathname === "/monthly-rental" ? "lg:w-[75%]" : "lg:w-[90%]"
        } mx-auto px-4 py-2.5 lg:px-6 lg:py-3 bg-white lg:rounded-lg ${
          isHomeLink.includes(location.pathname) && "-mt-12 md:-mt-28 lg:-mt-14"
        } shadow-lg ${
          !isHomeLink.includes(location.pathname)
            ? isSearchUpdatesActive
              ? "fixed w-full top-0 h-full z-50"
              : "relative hidden lg:block"
            : "relative rounded-lg z-10"
        }`}
        ref={searchRideContainerRef}
      >
        <div
          className={`${
            isHomeLink.includes(location.pathname) ? "hidden" : ""
          } lg:hidden flex items-center justify-between py-2 border-b-2`}
        >
          <h2 className="font-bold text-xl uppercase">
            Update <span className="text-theme">Search</span>
          </h2>
          <button type="button" onClick={() => dispatch(toggleSearchUpdate())}>
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
        <form
          className={`flex flex-wrap lg:grid ${
            location.pathname === "/monthly-rental"
              ? "grid-cols-3"
              : "grid-cols-4"
          } gap-3 lg:gap-4 ${isSearchUpdatesActive ? "mt-5" : "mt-1"} lg:mt-0`}
          ref={rideSubmitRef}
          onSubmit={handleSearchRide}
        >
          <div className="w-full">
            <label
              htmlFor="pickupLocation"
              className="text-gray-500 block mb-1"
            >
              Pick-up Location
            </label>
            <DropDownButtonWithIcon
              labelId={"pickupLocationId"}
              isDisabled={location.pathname == "/explore" ? true : false}
              value={id || ""}
            />
          </div>
          <div className="w-full">
            <label htmlFor="pickup-time" className="text-gray-500 block mb-1">
              Pick-up Date And Time
            </label>
            <DateTimePicker
              value={pickupDate}
              setValueChanger={setPickupDate}
              name={"pickup"}
              setDropoffChanger={setDropoffDate}
              timeValue={queryPickupTime}
              setTimeValueChanger={setQueryPickupTime}
            />
          </div>
          {location.pathname !== "/monthly-rental" && (
            <>
              <div className="w-full">
                <label
                  htmlFor="pickup-time"
                  className="text-gray-500 block mb-1"
                >
                  Pick-up Date And Time
                </label>
                <DateTimePicker
                  value={dropoffDate}
                  setValueChanger={setDropoffDate}
                  name={"dropoff"}
                  timeValue={queryDropoffTime}
                  setTimeValueChanger={setQueryDropoffTime}
                />
              </div>
            </>
          )}
          <Button
            buttonMessage={"Find"}
            handleStateChange={handletoggleSearchUpdate}
          />
        </form>
      </div>

      {/* mobile view  layout */}
      {location.pathname.includes("/search/") && (
        <MobileSearchRide
          pickup={pickupDateMobile?.date}
          dropoff={dropoffDateMobile?.date}
        />
      )}
    </>
  );
};

export default SearchRide;
