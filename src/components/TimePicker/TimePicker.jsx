import { useEffect, useRef, useState } from "react";
import { formatTimeWithoutSeconds, parseTime } from "../../utils";
import { useSelector } from "react-redux";

const TimePicker = ({
  value,
  name,
  setValueChanger,
  setDropoffChanger,
  date,
  isDisabled = false,
}) => {
  const [timeVisible, setTimeVisible] = useState(false);
  const { selectedStation } = useSelector((state) => state.station);
  const [dropdownPosition, setDropdownPosition] = useState("bottom"); // 'top' or 'bottom'
  const timePickerRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle selecting a time
  const handleTimeSelect = (time) => {
    setValueChanger(time);
    if (setDropoffChanger && name === "pickupTime") {
      setDropoffChanger(time);
    }
    setTimeVisible(false);
  };

  const generateTimes = () => {
    const times = [];
    const today = new Date();
    const selectedDate = new Date(date);

    // Set time comparison baseline to the current time if the date matches today's date
    const isToday = selectedDate.toDateString() === today.toDateString();
    const currentTime = isToday ? today : null;

    // Iterate over a 24-hour clock for proper order
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        const period = hour < 12 ? "AM" : "PM";
        const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
        const hourString =
          adjustedHour < 10 ? `0${adjustedHour}` : adjustedHour;
        const minuteString = minute < 10 ? `0${minute}` : minute;
        const timeString = `${hourString}:${minuteString} ${period}`;
        const timeDate = parseTime(timeString);

        const isOutsideAllowedRange =
          hour < selectedStation?.openStartTime ||
          hour > selectedStation?.openEndTime;

        // Also disable times before the current time if today
        let isDisabled;
        if (location.pathname?.includes("/explore")) {
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const timeDateMinutes =
            timeDate.getHours() * 60 + timeDate.getMinutes();
          // disable the past time
          isDisabled = timeDateMinutes < currentTime;
        } else {
          isDisabled =
            (isToday && timeDate < currentTime) || isOutsideAllowedRange;
        }
        // const isDisabled = isOutsideAllowedRange;

        times.push({ time: timeString, isDisabled });
      }
    }

    return times;
  };

  // with this we are changing the opening hour on based on station time
  useEffect(() => {
    generateTimes();
  }, [selectedStation]);

  useEffect(() => {
    if (value) {
      setValueChanger(formatTimeWithoutSeconds(value));
    }
  }, [value]);

  // for closing dropdown menu when user clicks outside anywhere on screen
  const handleClickOutside = (event) => {
    if (
      timePickerRef.current &&
      !timePickerRef.current.contains(event.target)
    ) {
      setTimeVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const checkDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (spaceBelow < 150 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  };

  useEffect(() => {
    if (timeVisible) {
      checkDropdownPosition();
    }
  }, [timeVisible]);

  return (
    <div className="relative" ref={timePickerRef}>
      <button
        type="button"
        className="flex items-center justify-between border-2 px-1.5 py-2.5 focus:border-theme rounded-lg relative w-full lg:w-auto"
        onClick={() => {
          setTimeVisible(!timeVisible);
          checkDropdownPosition();
        }}
        ref={buttonRef}
        disabled={isDisabled}
      >
        <div className="inline-flex items-center gap-0.5">
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
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </span>
          <input
            type="text"
            className="outline-none w-full cursor-pointer"
            placeholder="Select time"
            value={value}
            name={name}
            readOnly
          />
        </div>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 ${timeVisible && "rotate-180"}`}
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
      </button>

      {/* Time Picker Dropdown */}
      {timeVisible && (
        <div
          className={`absolute bg-white shadow-md rounded-md mt-1 z-10 border border-gray-300 w-full lg:w-72 ${
            dropdownPosition === "bottom" ? "top-14" : "bottom-14"
          }`}
        >
          <div className="p-2 max-h-60 overflow-y-auto">
            {generateTimes().map(({ time, isDisabled }, index) => (
              <button
                key={index}
                className="block w-full text-left p-2 hover:bg-blue-100 rounded-md disabled:text-gray-400"
                onClick={() => handleTimeSelect(time)}
                disabled={isDisabled}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
