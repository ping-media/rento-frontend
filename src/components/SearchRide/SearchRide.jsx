import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  formatTimeWithoutSeconds,
  isMinimumDurationHours,
  nextDayFromCurrent,
  searchFormatTimeOnly,
  timeStringToMillisecondsWithoutSeconds,
  updateTimeInISOString,
} from "../../utils";
import { searchData } from "../../Data/Functions";
import { handleAsyncError } from "../../utils/handleAsyncError";
import { isHomeLink } from "../../Data/dummyData";
import MobileSearchRide from "./MobileSearchRide";
import SearchBarSkeleton from "../skeleton/SearchBarSkeleton";
import SearchForm from "./SearchForm";

// checking whether it lies in opening hours or not
const isWithinOperatingHours = (time, startTime, endTime) => {
  if (startTime > endTime) {
    return time >= startTime || time <= endTime;
  } else {
    return time >= startTime && time <= endTime;
  }
};

// minimum time for booking a ride
const MinimumDurationHours = 24;

const SearchRide = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchRideContainerRef = useRef(null);
  const { id } = useParams();
  const { isSearchUpdatesActive } = useSelector((state) => state.modals);
  const { stationLoading, selectedStation } = useSelector(
    (state) => state.station,
  );
  const { loading, selectedLocation } = useSelector(
    (state) => state.selectedLocation,
  );
  // const [isPageLoad, setIsPageLoad] = useState(false);
  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);
  const [queryParms, setQueryParms] = useSearchParams();
  const [queryPickupTime, setQueryPickupTime] = useState("");
  const [queryDropoffTime, setQueryDropoffTime] = useState("");
  const hasFirstRender = useRef(false);
  const searchString = location.search;

  const searchParamsObj = useMemo(
    () => Object.fromEntries(queryParms.entries()),
    [searchString],
  );

  const now = useMemo(() => new Date(), []);

  // if searchFilter modal is active than run this
  const handletoggleSearchUpdate = () => {
    if (isSearchUpdatesActive) {
      dispatch(toggleSearchUpdate());
    }
  };

  // for searching vehicles
  const handleSearchRide = useCallback(
    (e) => {
      e && e.preventDefault();
      const response = new FormData(e.target);
      const result = Object.fromEntries(response.entries());

      if (!result?.pickupLocationId) {
        return handleAsyncError(dispatch, "Unable to get Station Data!");
      }

      // try {
      // const pickupDate = result.pickup.substring(0, 16);
      const pickupDate = result.pickup.split(/\d{1,2}:\d{2}/)[0].trim();
      const pickupTime = result.pickup.substring(17, result.pickup.length);
      // let dropoffDate = result?.dropoff?.substring(0, 16) || "";
      let dropoffDate = result?.dropoff?.split(/\d{1,2}:\d{2}/)[0].trim();
      // let dropoffTime =
      //   result?.dropoff?.substring(17, result.dropoff.length) || "";
      const dropoffTimeMatch = result?.dropoff?.match(
        /\d{1,2}:\d{2}\s?(AM|PM)/i,
      );
      let dropoffTime = dropoffTimeMatch ? dropoffTimeMatch[0] : "";

      // changing the drop date when user is coming from monthly page
      if (location.pathname === "/monthly-rental") {
        dropoffDate = addDaysToDateForRide(30, pickupDate);
        dropoffTime = pickupTime;
      }
      const covertedTime = parseInt(
        convertTo24HourFormat(pickupTime).replace(":00", ""),
      );

      if (new Date(result.pickup) > new Date(result.dropoff)) {
        handleAsyncError(
          dispatch,
          "Drop Date and time should be ahead of pickup date and time.",
        );
        return;
      }

      // checking whether the minimum duration should be 6 hour or more
      const isMinDuration = isMinimumDurationHours(
        result.pickup,
        result.dropoff,
        MinimumDurationHours,
      );

      if (location.pathname !== "/monthly-rental" && !isMinDuration)
        return handleAsyncError(
          dispatch,
          `Minimum Interval between dates should be ${MinimumDurationHours} hours`,
        );

      const pickupDateTime = new Date(result.pickup);
      // const now = new Date();
      if (
        pickupDateTime > now &&
        !isWithinOperatingHours(
          covertedTime,
          selectedStation?.openStartTime,
          selectedStation?.openEndTime,
        )
      ) {
        return handleAsyncError(
          dispatch,
          `Time should be in opening hour ${selectedStation?.openStartTime}:00 - ${selectedStation?.openEndTime}:00`,
        );
      }

      return navigate(
        `/search/${
          result?.pickupLocationId
        }?BookingStartDateAndTime=${convertToISOString(
          pickupDate,
          pickupTime,
        )}&BookingEndDateAndTime=${convertToISOString(dropoffDate, dropoffTime)}`,
      );
      // }
      // catch (error) {
      //   navigate(`/error-${error?.message}`);
      // }
    },
    [selectedStation, location.pathname, now, dispatch, navigate],
  );

  // this function is fetching station based on location id
  const memoizedSearchData = useCallback(() => {
    searchData(
      dispatch,
      selectedLocation,
      fetchingStation,
      addStationData,
      loading,
    );
  }, [loading, selectedLocation, dispatch]);

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
    // this will set time and date for the first time on homepage and monthly-rental page
    if (location.pathname === "/" || location.pathname === "/monthly-rental") {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setPickupDate(now);
      setDropoffDate(nextDayFromCurrent(now));
      // setPickupDate(new Date());
      // setDropoffDate(nextDayFromCurrent(new Date()));
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
      const currentTime = now.getHours();
      // const currentTime = new Date().getHours();
      const openEndTime = Number(selectedStation?.openEndTime);
      const openStartTime = Number(selectedStation?.openStartTime);
      // change date & time after end time
      if (currentTime >= openEndTime) {
        const nextday = nextDayFromCurrent(now);
        // const nextday = nextDayFromCurrent(new Date());
        // changing date
        setPickupDate(nextDayFromCurrent(now));
        // setPickupDate(nextDayFromCurrent(new Date()));
        setDropoffDate(nextDayFromCurrent(nextday));
        // changing time
        setQueryPickupTime(
          format24HourFormatTime(selectedStation?.openStartTime),
        );
        setQueryDropoffTime(
          format24HourFormatTime(selectedStation?.openStartTime),
        );
        // change time to openStartTime if current time does not match
      } else if (currentTime < openStartTime) {
        setQueryPickupTime(
          format24HourFormatTime(selectedStation?.openStartTime),
        );
        setQueryDropoffTime(
          format24HourFormatTime(selectedStation?.openStartTime),
        );
      }
    }
  }, [selectedStation]);

  useEffect(() => {
    if (!location.pathname.includes("/search/")) return;
    try {
      // setIsPageLoad(true);
      // const newQueryParmsData = Object.fromEntries(queryParms.entries());
      const newQueryParmsData = searchParamsObj;
      const pickUpDateAndTime = newQueryParmsData?.BookingStartDateAndTime;
      const dropoffDateAndTime = newQueryParmsData?.BookingEndDateAndTime;
      // for checking station time
      const currentHour = now.getHours();
      // const currentHour = new Date().getHours();
      const openStartTime = Number(selectedStation?.openStartTime);
      const openEndTime = Number(selectedStation?.openEndTime);
      // const currentTime = new Date().toLocaleTimeString("en-GB", {
      const currentTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const pickupTime = pickUpDateAndTime?.split("T")[1]?.replace("Z", "");
      const withinStationTime =
        currentHour > openStartTime && currentHour < openEndTime;

      if (pickUpDateAndTime && dropoffDateAndTime && withinStationTime) {
        const pickupDate = pickUpDateAndTime.split("T")[0];
        const dropoffDate = dropoffDateAndTime.split("T")[0];
        setPickupDate(new Date(pickupDate));
        setDropoffDate(new Date(dropoffDate));

        // const pickupDateObj = new Date(pickUpDateAndTime);
        // const isPickupToday =
        //   pickupDateObj.toDateString() === now.toDateString();

        // if (
        //   isPickupToday &&
        //   timeStringToMillisecondsWithoutSeconds(currentTime) >
        //     timeStringToMillisecondsWithoutSeconds(pickupTime)
        // ) {
        //   setQueryPickupTime(formatTimeWithoutSeconds(currentTime));
        //   setQueryDropoffTime(formatTimeWithoutSeconds(currentTime));
        //   queryParms.set(
        //     "BookingStartDateAndTime",
        //     updateTimeInISOString(
        //       pickUpDateAndTime,
        //       formatTimeWithoutSeconds(currentTime),
        //     ).replace(".000Z", "Z"),
        //   );
        //   queryParms.set(
        //     "BookingEndDateAndTime",
        //     updateTimeInISOString(
        //       dropoffDateAndTime,
        //       formatTimeWithoutSeconds(currentTime),
        //     ).replace(".000Z", "Z"),
        //   );
        //   setQueryParms(queryParms);
        // } else {
        //   setQueryPickupTime(searchFormatTimeOnly(pickUpDateAndTime));
        //   setQueryDropoffTime(searchFormatTimeOnly(dropoffDateAndTime));
        // }

        if (
          timeStringToMillisecondsWithoutSeconds(currentTime) >
          timeStringToMillisecondsWithoutSeconds(pickupTime)
        ) {
          setQueryPickupTime(formatTimeWithoutSeconds(currentTime));
          setQueryDropoffTime(formatTimeWithoutSeconds(currentTime));
          queryParms.set(
            "BookingStartDateAndTime",
            updateTimeInISOString(
              pickUpDateAndTime,
              formatTimeWithoutSeconds(currentTime),
            ).replace(".000Z", "Z"),
          );
          queryParms.set(
            "BookingEndDateAndTime",
            updateTimeInISOString(
              dropoffDateAndTime,
              formatTimeWithoutSeconds(currentTime),
            ).replace(".000Z", "Z"),
          );
          setQueryParms(queryParms);
        } else {
          setQueryPickupTime(searchFormatTimeOnly(pickUpDateAndTime));
          setQueryDropoffTime(searchFormatTimeOnly(dropoffDateAndTime));
        }
      } else {
        const pickupDate = pickUpDateAndTime.split("T")[0];
        const dropoffDate = dropoffDateAndTime.split("T")[0];
        setPickupDate(new Date(pickupDate));
        setDropoffDate(new Date(dropoffDate));
        setQueryPickupTime(searchFormatTimeOnly(pickUpDateAndTime));
        setQueryDropoffTime(searchFormatTimeOnly(dropoffDateAndTime));
      }
    } catch (error) {
      navigate("/error");
    } finally {
      // setIsPageLoad(false);
    }
  }, [location.pathname, searchString, searchParamsObj]);
  // }, [location.pathname, queryParms]);

  const isLoadingSkeleton =
    stationLoading && location.pathname.includes("/search/");

  // show loading state
  // if (isPageLoad && stationLoading) {
  if (isLoadingSkeleton) {
    return <SearchBarSkeleton />;
  }

  const isMonthly = location.pathname === "/monthly-rental";
  const isExplore = location.pathname === "/explore";

  // form props
  const formProps = useMemo(
    () => ({
      handleSearchRide,
      id,
      handletoggleSearchUpdate,
      pickupDate,
      setPickupDate,
      setDropoffDate,
      queryPickupTime,
      setQueryPickupTime,
      setQueryDropoffTime,
      dropoffDate,
      queryDropoffTime,
      isMonthly,
      isExplore,
      isSearchUpdatesActive,
    }),
    [
      handleSearchRide,
      id,
      pickupDate,
      queryPickupTime,
      dropoffDate,
      queryDropoffTime,
      isMonthly,
      isExplore,
      isSearchUpdatesActive,
    ],
  );

  return (
    <>
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
        <SearchForm {...formProps} />
      </div>

      {/* mobile view  layout */}
      {location.pathname.includes("/search/") && (
        <MobileSearchRide pickup={pickupDate} dropoff={dropoffDate} />
      )}
    </>
  );
};

export default SearchRide;
