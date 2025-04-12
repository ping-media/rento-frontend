import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import PreLoader from "../skeleton/PreLoader";
import { handleCheckLocationChange } from "../../Redux/LocationSlice/LocationSlice";
import { useLocation } from "react-router-dom";
import { updateStationId } from "../../utils";
import { addCurrentStation } from "../../Redux/StationSlice/StationSlice";

const DropDownButtonWithIcon = ({ labelId, isDisabled, value }) => {
  const [isOpened, setIsOpened] = useState(false);
  const { loading, station } = useSelector((state) => state.station);
  const { isLocationChange } = useSelector((state) => state.selectedLocation);
  const [changeStationLoading, setChangeLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueId, setSelectedValueId] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const customLocation = useLocation();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    try {
      if (!loading) {
        setChangeLoading(true);
        // when changing the location this will run
        if (isLocationChange === true && station.length > 0) {
          setSelectedValue(station[0]?.stationName);
          setSelectedValueId(station[0]?.stationId);
          // for updating the url based on new station
          updateStationId(customLocation, station[0]?.stationId);
          // changing the flag to false so that this function don't run every time
          dispatch(handleCheckLocationChange());
        } else if (station.length > 0 && value) {
          const stationDataById = station?.filter(
            (item) => item?.stationId === value
          );
          setSelectedValue(stationDataById[0]?.stationName);
          setSelectedValueId(stationDataById[0]?.stationId);
        } else if (station.length > 0) {
          setSelectedValue(station[0]?.stationName);
          setSelectedValueId(station[0]?.stationId);
        } else {
          setSelectedValue("No Station Found");
        }
        setChangeLoading(false);
      }
    } catch (error) {
      return error?.message;
    }
  }, [loading, station]);

  // for changing selectedStation whenever station list change so that station time can change too
  useEffect(() => {
    if (station?.length > 0) {
      dispatch(addCurrentStation(station[0]));
    }
  }, [station]);

  // for changing station when we click on station
  const handleLocationChange = (item) => {
    setSelectedValueId(item?.stationId);
    setSelectedValue(item?.stationName);
    // adding current station data for changing time based on station
    dispatch(addCurrentStation(item));
  };

  // For closing the dropdown menu when the user clicks outside anywhere on screen
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpened(false);
    }
  };

  // Detect dropdown position relative to the viewport
  const checkDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // Set position based on available space
      if (spaceBelow < 150 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  };

  useEffect(() => {
    // Bind the event listener for clicking outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Check dropdown position when it opens
    if (isOpened) {
      checkDropdownPosition();
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpened]);

  return !changeStationLoading ? (
    <button
      className="border-2 px-1.5 py-2.5 focus:border-theme rounded-lg relative w-full"
      onClick={() => {
        if (!isDisabled) {
          setIsOpened(!isOpened);
          checkDropdownPosition();
        }
      }}
      type="button"
      id={labelId}
      disabled={isDisabled || (!loading && station?.length > 0) ? false : true}
      ref={buttonRef}
    >
      <input
        type="hidden"
        name={labelId}
        value={!isDisabled ? selectedValueId || "" : ""}
      />
      <div>
        <div className="flex items-center justify-between gap-2 truncate">
          <div className="flex items-center gap-0.5">
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
            <span className="capitalize">
              {!isDisabled ? selectedValue : "All Station"}
            </span>
          </div>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 ${isOpened && "rotate-180"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
        {isOpened && (
          <div
            className={`absolute z-40 left-0 bg-white w-full transition duration-200 ease-in-out border rounded-lg max-h-32 overflow-hidden hover:overflow-y-auto ${
              dropdownPosition === "bottom" ? "top-14" : "bottom-14"
            }`}
            ref={dropdownRef}
          >
            <ul className="py-1">
              {!loading ? (
                station.length > 0 ? (
                  station.map((item) => (
                    <li
                      key={item?.stationId}
                      className="w-full text-left py-1 hover:bg-gray-300 hover:bg-opacity-50 px-6 py-3 capitalize"
                      onClick={() => {
                        handleLocationChange(item);
                      }}
                    >
                      {item?.stationName}
                    </li>
                  ))
                ) : (
                  <li className="w-full text-left py-1 hover:bg-gray-300 hover:bg-opacity-50 px-6 py-3">
                    No Station Found
                  </li>
                )
              ) : (
                <li className="animate-pulse">
                  <Spinner message={"loading.."} />
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </button>
  ) : (
    <PreLoader />
  );
};

export default DropDownButtonWithIcon;
