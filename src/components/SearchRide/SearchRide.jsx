import React, { useCallback, useEffect, useRef, useState } from "react";
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
  convertLocalToUTCISOString,
  convertTo24HourFormat,
  convertToISOString,
  format24HourFormatTime,
  formatTimeWithoutSeconds,
  isMinimumDurationHours,
  // isSecondTimeSmaller,
  nextDayFromCurrent,
  removeAfterSecondSlash,
  // removeSecondsFromTimeString,
  // RoundedDateTimeAndToNextHour,
  // searchFormatDateOnly,
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
  const [queryParms, setQueryParms] = useSearchParams();
  const [queryPickupTime, setQueryPickupTime] = useState("");
  const [queryDropoffTime, setQueryDropoffTime] = useState("");
  const rideSubmitRef = useRef(null);
  const hasFirstRender = useRef(false);
  // minimum time for booking a ride
  const MinimumDurationHours = 24;

  // if searchFilter modal is active than run this
  const handletoggleSearchUpdate = () => {
    if (isSearchUpdatesActive) {
      dispatch(toggleSearchUpdate());
    }
  };

  // checking whether it lies in opening hours or not
  const isWithinOperatingHours = (time, startTime, endTime) => {
    if (startTime > endTime) {
      return time >= startTime || time <= endTime;
    } else {
      return time >= startTime && time <= endTime;
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

    if (new Date(result.pickup) > new Date(result.dropoff)) {
      handleAsyncError(
        dispatch,
        "Drop Date and time should be ahead of pickup date and time."
      );
      return;
    }

    // checking whether the minimum duration should be 24 hour or more
    const isMinDuration = isMinimumDurationHours(
      result.pickup,
      result.dropoff,
      MinimumDurationHours
    );

    if (location.pathname !== "/monthly-rental" && !isMinDuration)
      return handleAsyncError(
        dispatch,
        `Minimum Interval between dates should be ${MinimumDurationHours} hours`
      );
    // checking whether the time is in opening hour
    if (
      !isWithinOperatingHours(
        covertedTime,
        selectedStation?.openStartTime,
        selectedStation?.openEndTime
      )
    ) {
      return handleAsyncError(
        dispatch,
        `Time should be in opening hour ${selectedStation?.openStartTime}:00 - ${selectedStation?.openEndTime}:00`
      );
    }
    try {
      if (location.pathname !== "monthly-rental") {
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
        }
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
  }, [loading, selectedLocation]);

  useEffect(() => {
    if (location.pathname.includes("/search/") && !hasFirstRender.current) {
      hasFirstRender.current = true;
      return;
    }
    if (location.pathname === "/" || hasFirstRender.current) {
      memoizedSearchData();
    }
  }, [memoizedSearchData]);

  useEffect(() => {
    // this will set time and date for the first time on homepage
    if (location.pathname === "/") {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setPickupDate(new Date());
      setDropoffDate(nextDayFromCurrent(new Date()));
      setQueryPickupTime(currentTime);
      setQueryDropoffTime(currentTime);
      if (pickupDate) {
        setDropoffDate(nextDayFromCurrent(new Date(pickupDate)));
      }
      if (queryPickupTime != "") {
        setQueryDropoffTime(queryPickupTime);
      }
    }
  }, [location.pathname]);

  // changing date & time if time is passed openning hour
  useEffect(() => {
    if (selectedStation !== null) {
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
      } else if (currentTime < openStartTime) {
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
      // for checking station time
      const currentHour = new Date().getHours();
      const openStartTime = Number(selectedStation?.openStartTime);
      // for desktop full view
      if (pickUpDateAndTime && dropoffDateAndTime) {
        const withinStationTime = currentHour < openStartTime;
        const currentTime = new Date()?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const pickupDate = pickUpDateAndTime.split("T")[0];
        const dropoffDate = dropoffDateAndTime.split("T")[0];
        const querypickupDateTime = convertLocalToUTCISOString(
          `${new Date(
            pickupDate
          ).toLocaleDateString()} ${formatTimeWithoutSeconds(currentTime)}`
        );
        const querydropoffDateTime = convertLocalToUTCISOString(
          `${new Date(
            dropoffDate
          ).toLocaleDateString()} ${formatTimeWithoutSeconds(currentTime)}`
        );

        setPickupDate(new Date(pickupDate));
        setDropoffDate(new Date(dropoffDate));

        // if (searchFormatTimeOnly(pickUpDateAndTime) < currentTime) {
        // if (pickUpDateAndTime < querypickupDateTime) {
        // console.log(
        //   pickUpDateAndTime <
        //     convertLocalToUTCISOString(
        //       `${new Date(pickupDate).toLocaleDateString()} ${currentTime}`
        //     )
        // );
        if (
          pickUpDateAndTime <
          convertLocalToUTCISOString(
            `${new Date(pickupDate).toLocaleDateString()} ${currentTime}` &&
              withinStationTime
          )
        ) {
          setQueryPickupTime(formatTimeWithoutSeconds(currentTime));
          setQueryDropoffTime(formatTimeWithoutSeconds(currentTime));
          queryParms.set("BookingStartDateAndTime", querypickupDateTime);
          queryParms.set("BookingEndDateAndTime", querydropoffDateTime);
          setQueryParms(queryParms);
        } else {
          // console.log(
          //   formatTimeWithoutSeconds(searchFormatTimeOnly(dropoffDateAndTime)),
          //   formatTimeWithoutSeconds(searchFormatTimeOnly(pickUpDateAndTime))
          // );
          // setQueryDropoffTime(searchFormatTimeOnly(dropoffDateAndTime));
          // setQueryPickupTime(searchFormatTimeOnly(pickUpDateAndTime));
          setQueryDropoffTime(
            formatTimeWithoutSeconds(searchFormatTimeOnly(dropoffDateAndTime))
          );
          setQueryPickupTime(
            formatTimeWithoutSeconds(searchFormatTimeOnly(pickUpDateAndTime))
          );
        }
      }
    } finally {
      // catch (error) {
      //   navigate(`/error?message=${error?.message}`);
      // }
      setIsPageLoad(false);
    }
  }, [location.pathname]);

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
              setDropTimeValueChanger={setQueryDropoffTime}
            />
          </div>
          {location.pathname !== "/monthly-rental" && (
            <>
              <div className="w-full">
                <label
                  htmlFor="pickup-time"
                  className="text-gray-500 block mb-1"
                >
                  Drop-off Date And Time
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
      {/* {location.pathname.includes("/search/") && (
        <MobileSearchRide pickup={pickupDate} dropoff={dropoffDate} />
      )} */}
    </>
  );
};

export default SearchRide;
