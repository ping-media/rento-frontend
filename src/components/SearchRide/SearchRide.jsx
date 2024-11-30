import { useEffect, useRef, useState } from "react";
import DatePicker from "../DatePicker/DatePicker";
import TimePicker from "../TimePicker/TimePicker";
import Button from "../Button/Button";
import DropDownButtonWithIcon from "../DropdownButton/DropDownButtonWithIcon";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchUpdate } from "../../Redux/ModalSlice/ModalSlice";
import { fetchingData } from "../../Data";
import {
  addStationData,
  fetchingStation,
} from "../../Redux/StationSlice/StationSlice";
import {
  convertToISOString,
  nextDayFromCurrent,
  removeAfterSecondSlash,
} from "../../utils";

const SearchRide = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchRideContainerRef = useRef(null);
  const [containerOnTop, setContainerOnTop] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const { isSearchUpdatesActive } = useSelector((state) => state.modals);
  const { loading, selectedLocation } = useSelector(
    (state) => state.selectedLocation
  );
  const [queryParms] = useSearchParams();
  const [queryParmsData] = useState(Object.fromEntries(queryParms.entries()));
  const [queryPickupDate, setQueryPickupDate] = useState(null);
  const [queryDropoffDate, setQueryDropoffDate] = useState(null);
  const [queryPickupTime, setQueryPickupTime] = useState(null);
  const [queryDropoffTime, setQueryDropoffTime] = useState(null);
  // if searchFilter modal is active than run this
  const handletoggleSearchUpdate = () => {
    if (isSearchUpdatesActive) {
      dispatch(toggleSearchUpdate());
    }
  };

  const handleSearchRide = (e) => {
    e.preventDefault();
    if (
      location.pathname == "/" ||
      removeAfterSecondSlash(location.pathname) == "/search"
    ) {
      const response = new FormData(e.target);
      const result = Object.fromEntries(response.entries());
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
    }
  };

  useEffect(() => {
    if (location.pathname == "/") {
      setIsHomePage(!isHomePage);
    }
    // this code is to change the direction of opening the option dropdown whether it goes up or down
    if (searchRideContainerRef.current.getBoundingClientRect().top < 100) {
      setContainerOnTop(!containerOnTop);
    }
  }, [location.href]);

  useEffect(() => {
    const searchData = async () => {
      try {
        if (!loading && Object.entries(selectedLocation).length > 0) {
          dispatch(fetchingStation());
          const result = await fetchingData(
            `/getStationData?locationId=${selectedLocation?.locationId}`
          );
          if (result) {
            // console.log(result?.data);
            return dispatch(addStationData(result?.data));
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    searchData();
  }, [selectedLocation]);

  useEffect(() => {
    if (
      queryParmsData?.BookingStartDateAndTime &&
      queryParmsData?.BookingEndDateAndTime
    ) {
      const pickupDate = new Date(
        queryParmsData?.BookingStartDateAndTime
      )?.toLocaleDateString();
      const pickupTime = new Date(
        queryParmsData?.BookingStartDateAndTime
      )?.toLocaleTimeString();
      const dropoffDate = new Date(
        queryParmsData?.BookingEndDateAndTime
      )?.toLocaleDateString();
      const dropoffTime = new Date(
        queryParmsData?.BookingEndDateAndTime
      )?.toLocaleTimeString();
      setQueryPickupDate(pickupDate);
      setQueryPickupTime(pickupTime);
      setQueryDropoffDate(dropoffDate);
      setQueryDropoffTime(dropoffTime);
    }
  }, []);

  return (
    <div
      className={`w-[95%] lg:w-[90%] mx-auto px-4 py-1 lg:px-6 lg:py-3 bg-white lg:rounded-lg ${
        isHomePage && "-mt-36 md:-mt-28 lg:-mt-14"
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
        className={`flex flex-wrap lg:grid grid-cols-7 gap-3 lg:gap-4 ${
          isSearchUpdatesActive ? "mt-5" : "mt-1"
        } lg:mt-0`}
        onSubmit={handleSearchRide}
      >
        <div className="w-full lg:col-span-2">
          <label htmlFor="pickupLocation" className="text-gray-400 block mb-1">
            Pick-up Location
          </label>
          <DropDownButtonWithIcon
            containerOnTop={containerOnTop}
            labelId={"pickupLocationId"}
          />
        </div>
        <div className="w-full">
          <label htmlFor="pickup-date" className="text-gray-400 block mb-1">
            Pick-up Date
          </label>
          <DatePicker
            containerOnTop={containerOnTop}
            placeholderMessage={"Select Pick-up Date"}
            value={queryPickupDate != null || new Date().toLocaleDateString()}
            name={"pickupDate"}
          />
        </div>
        <div className="w-full">
          <label htmlFor="pickup-time" className="text-gray-400 block mb-1">
            Pick-up Time
          </label>
          <TimePicker
            containerOnTop={containerOnTop}
            labelId="pickup-time"
            value={queryPickupTime != null || new Date().toLocaleTimeString()}
            name={"pickupTime"}
          />
        </div>
        <div className="w-full">
          <label htmlFor="dropoff-date" className="text-gray-400 block mb-1">
            Drop-off Date
          </label>
          <DatePicker
            containerOnTop={containerOnTop}
            placeholderMessage={"Select Drop-off Date"}
            value={queryDropoffDate != null || nextDayFromCurrent(new Date())}
            name={"dropoffDate"}
          />
        </div>
        <div className="w-full">
          <label htmlFor="dropoff-time" className="text-gray-400 block mb-1">
            Drop-off Time
          </label>
          <TimePicker
            containerOnTop={containerOnTop}
            labelId="dropoff-time"
            value={queryDropoffTime != null || new Date().toLocaleTimeString()}
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
