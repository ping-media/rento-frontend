import React, { useState, useEffect, useRef } from "react";
import { formatTimeWithoutSeconds, parseTime } from "../../utils";

const TimePicker = ({ value, name, setValueChanger, setDropoffChanger }) => {
  // const [selectedTime, setSelectedTime] = useState("");
  const [timeVisible, setTimeVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom"); // 'top' or 'bottom'
  const timePickerRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle selecting a time
  const handleTimeSelect = (time) => {
    // setSelectedTime(time);
    setValueChanger(time);
    if (setDropoffChanger && name == "pickupTime") {
      setDropoffChanger(time);
    }
    setTimeVisible(false);
  };

  const generateTimes = () => {
    const times = [];

    // Outer loop for AM and PM periods
    for (let period of ["AM", "PM"]) {
      for (let h = 1; h <= 12; h++) {
        for (let m = 0; m < 60; m += 60) {
          // Formatting hours and minutes
          const hour = h < 10 ? `0${h}` : h;
          const minute = m === 0 ? "00" : m < 10 ? `0${m}` : m;

          // Format the time string with the current period (AM or PM)
          const time = `${hour}:${minute} ${period}`;
          times.push(time);
        }
      }
    }

    return times;
  };

  useEffect(() => {
    if (value) {
      // console.log(value);
      // setSelectedTime(formatTimeWithoutSeconds(value));
      setValueChanger(formatTimeWithoutSeconds(value));
    }
  }, [value]);

  // for closing dropdown menu when user click outside anywhere on screen
  const handleClickOutside = (event) => {
    if (
      timePickerRef.current &&
      !timePickerRef.current.contains(event.target)
    ) {
      setTimeVisible(false);
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Detect dropdown position relative to the viewport
  const checkDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // Set position based on available space
      if (spaceBelow < 150 && spaceAbove > spaceBelow) {
        setDropdownPosition("top"); // Position above the button
      } else {
        setDropdownPosition("bottom"); // Position below the button
      }
    }
  };

  useEffect(() => {
    // Check dropdown position when it opens
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
          checkDropdownPosition(); // Check position when toggling
        }}
        ref={buttonRef}
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
          className={`absolute bg-white shadow-md rounded-md mt-1 z-50 border border-gray-300 w-full lg:w-72 ${
            dropdownPosition === "bottom" ? "top-14" : "bottom-14"
          }`}
        >
          <div className="p-2 max-h-60 overflow-y-auto">
            {generateTimes().map((time, index) => (
              <button
                key={index}
                className="block w-full text-left p-2 hover:bg-blue-100 rounded-md disabled:text-gray-400"
                onClick={() => handleTimeSelect(time)}
                disabled={parseTime(time) < new Date() ? true : false}
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
