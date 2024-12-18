import { useEffect, useRef, useState } from "react";
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
  convertToISOString,
  nextDayFromCurrent,
  removeAfterSecondSlash,
} from "../../utils";
import { searchData } from "../../Data/Functions";

const SearchRide = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchRideContainerRef = useRef(null);
  const { id } = useParams();
  const [isHomePage, setIsHomePage] = useState(false);
  const { isSearchUpdatesActive } = useSelector((state) => state.modals);
  const { loading, selectedLocation } = useSelector(
    (state) => state.selectedLocation
  );
  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);
  const [queryParms] = useSearchParams();
  const [queryParmsData, setQueryParmsData] = useState(
    Object.fromEntries(queryParms.entries())
  );
  const [queryPickupTime, setQueryPickupTime] = useState("");
  const [queryDropoffTime, setQueryDropoffTime] = useState("");

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
    if (
      location.pathname == "/" ||
      removeAfterSecondSlash(location.pathname) == "/search"
    ) {
      if (result?.pickupLocationId != "") {
        return navigate(
          `/search/${
            result?.pickupLocationId
          }?BookingStartDateAndTime=${convertToISOString(
            result?.pickupDate,
            result?.pickupTime
          )}&BookingEndDateAndTime=${convertToISOString(
            result?.dropoffDate,
            result?.dropoffTime
          )}`
        );
      }
    } else if (location.pathname == "/explore") {
      return navigate(
        `/explore?BookingStartDateAndTime=${convertToISOString(
          result?.pickupDate,
          result?.pickupTime
        )}&BookingEndDateAndTime=${convertToISOString(
          result?.dropoffDate,
          result?.dropoffTime
        )}`
      );
    }
  };

  // this code is to change the direction of opening the option dropdown whether it goes up or down
  useEffect(() => {
    if (location.pathname == "/") {
      setIsHomePage(!isHomePage);
    }
  }, [location.href]);

  // this function is fetching station based on location id
  useEffect(() => {
    searchData(
      dispatch,
      selectedLocation,
      fetchingStation,
      addStationData,
      loading
    );
  }, [location.pathname, selectedLocation]);

  useEffect(() => {
    // Destructure BookingStartDateAndTime and BookingEndDateAndTime
    setQueryParmsData(Object.fromEntries(queryParms.entries()));
    const { BookingStartDateAndTime, BookingEndDateAndTime } = queryParmsData;

    // Function to format dates
    const formatDateOnly = (dateStr) => new Date(dateStr);
    const formatTimeOnly = (dateStr) => {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC", // or another time zone
      }).format(date);
    };

    if (BookingStartDateAndTime && BookingEndDateAndTime) {
      // Set state with formatted values
      setPickupDate(formatDateOnly(BookingStartDateAndTime));
      setDropoffDate(formatDateOnly(BookingEndDateAndTime));
      setQueryPickupTime(formatTimeOnly(BookingStartDateAndTime));
      setQueryDropoffTime(formatTimeOnly(BookingEndDateAndTime));
    } else {
      // Set default dates if data not found
      setPickupDate(new Date());
      setDropoffDate(nextDayFromCurrent(new Date()));
      setQueryPickupTime(new Date().toLocaleTimeString());
      setQueryDropoffTime(new Date().toLocaleTimeString());
    }
  }, [location?.href]);

  //  through this we are changing the dropoffdate && dropOffTime by one for one time only
  useEffect(() => {
    if (pickupDate) {
      setDropoffDate(nextDayFromCurrent(new Date(pickupDate)));
    }
    if (queryPickupTime != "") {
      setQueryDropoffTime(queryPickupTime);
    }
  }, []);

  return (
    <div
      className={`w-[95%] lg:w-[90%] mx-auto px-4 py-2.5 lg:px-6 lg:py-3 bg-white lg:rounded-lg ${
        isHomePage && "-mt-32 md:-mt-28 lg:-mt-14"
      } shadow-lg ${
        !isHomePage
          ? isSearchUpdatesActive
            ? "absolute w-full top-0 h-full z-50"
            : "relative hidden lg:block"
          : "relative rounded-lg"
      }`}
      ref={searchRideContainerRef}
    >
      <div
        className={`${
          isHomePage ? "hidden" : ""
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
        className={`flex flex-wrap lg:grid grid-cols-6 gap-3 lg:gap-4 ${
          isSearchUpdatesActive ? "mt-5" : "mt-1"
        } lg:mt-0`}
        onSubmit={handleSearchRide}
      >
        <div className="w-full">
          <label htmlFor="pickupLocation" className="text-gray-500 block mb-1">
            Pick-up Location
          </label>
          <DropDownButtonWithIcon
            labelId={"pickupLocationId"}
            isDisabled={location.pathname == "/explore" ? true : false}
            value={id || ""}
          />
        </div>
        <div className="w-full">
          <label htmlFor="pickup-date" className="text-gray-500 block mb-1">
            Pick-up Date
          </label>
          <DatePicker
            placeholderMessage={"Select Pick-up Date"}
            value={pickupDate}
            setValueChanger={setPickupDate}
            name={"pickupDate"}
            setDropoffChanger={setDropoffDate}
          />
        </div>
        <div className="w-full">
          <label htmlFor="pickup-time" className="text-gray-500 block mb-1">
            Pick-up Time
          </label>
          <TimePicker
            labelId="pickup-time"
            value={queryPickupTime}
            setValueChanger={setQueryPickupTime}
            name={"pickupTime"}
            setDropoffChanger={setQueryDropoffTime}
          />
        </div>
        <div className="w-full">
          <label htmlFor="dropoff-date" className="text-gray-500 block mb-1">
            Drop-off Date
          </label>
          <DatePicker
            placeholderMessage={"Select Drop-off Date"}
            value={dropoffDate}
            setValueChanger={setDropoffDate}
            name={"dropoffDate"}
          />
        </div>
        <div className="w-full">
          <label htmlFor="dropoff-time" className="text-gray-500 block mb-1">
            Drop-off Time
          </label>
          <TimePicker
            labelId="dropoff-time"
            value={queryDropoffTime}
            setValueChanger={setQueryDropoffTime}
            name={"dropoffTime"}
          />
        </div>
        <Button
          buttonMessage={"Find"}
          handleStateChange={handletoggleSearchUpdate}
        />
      </form>
    </div>
  );
};

export default SearchRide;
