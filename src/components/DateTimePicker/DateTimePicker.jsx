import React, { useState, useRef, useEffect } from "react";
import {
  formatDate,
  formatTimeWithoutSeconds,
  nextDayFromCurrent,
  parseTime,
} from "../../utils";
import { useSelector } from "react-redux";

const DatePicker = ({
  value,
  name,
  setValueChanger,
  setDropoffChanger,
  timeValue,
  setTimeValueChanger,
}) => {
  const datePickerRef = useRef(null);
  const timePickerRef = useRef(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const { selectedStation } = useSelector((state) => state.station);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear] = useState(currentDate.getFullYear());

  const generateTimes = () => {
    const times = [];
    const today = new Date();
    const selectedDate = new Date(value);

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
    if (calendarVisible && timePickerRef.current) {
      const activeButton = timePickerRef.current.querySelector(".active");
      if (activeButton && timePickerRef.current) {
        timePickerRef.current.scrollTop =
          activeButton.offsetTop - timePickerRef.current.offsetTop;
      }
    }
  }, [calendarVisible, timeValue]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Handle date selection
  const handleDateSelect = (date) => {
    setValueChanger(date);
    if (setDropoffChanger && name === "pickupDate") {
      const tempDropoffDate = nextDayFromCurrent(date);
      setDropoffChanger(tempDropoffDate);
    }
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setTimeValueChanger(time);
    setCalendarVisible(false);
  };

  // Close on outside click
  const handleClickOutside = (event) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      setCalendarVisible(false);
    }
  };

  // Detect dropdown position relative to the viewport
  const checkDropdownPosition = () => {
    if (datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Set position based on available space
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Check dropdown position when the calendar becomes visible
    if (calendarVisible) {
      checkDropdownPosition();
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarVisible]);

  return (
    <div className="relative" ref={datePickerRef}>
      {/* Date Picker Input */}
      <button
        type="button"
        className="flex items-center justify-between border-2 px-1.5 py-2.5 focus:border-theme rounded-lg relative w-full"
        onClick={() => setCalendarVisible(!calendarVisible)}
      >
        <div className="w-full flex items-center justify-between gap-0.5">
          <span>
            {" "}
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>
          </span>
          <input
            type="text"
            className="outline-none w-full cursor-pointer"
            placeholder="Select date & time"
            value={`${formatDate(new Date(value))} ${formatTimeWithoutSeconds(
              timeValue
            )}`}
            name={name}
            readOnly
          />
        </div>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 ${calendarVisible && "rotate-180"}`}
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

      {/* Calendar + Time Picker Container */}
      {calendarVisible && (
        <div
          className={`absolute bg-white shadow-md rounded-md mt-1 z-30 lg:z-10 border border-gray-300 w-full lg:w-96 p-2 flex ${
            dropdownPosition === "top" ? "bottom-full mb-2" : "top-full"
          }`}
        >
          {/* Calendar Section (Left) */}
          <div className="w-2/3 border-r pr-2">
            <div className="flex justify-between mb-2 items-center">
              <button
                onClick={() => setCurrentMonth(currentMonth - 1)}
                className="text-gray-500 hover:text-theme disabled:text-gray-300"
                type="button"
                disabled={new Date().getMonth() == currentMonth ? true : false}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <div className="text-center font-semibold">{`${new Date(
                currentYear,
                currentMonth
              ).toLocaleString("default", {
                month: "long",
              })} ${currentYear}`}</div>
              <button
                onClick={() => setCurrentMonth(currentMonth + 1)}
                className="text-gray-500 hover:text-theme disabled:text-gray-300"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-gray-500">
                  {day}
                </div>
              ))}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                return (
                  <button
                    type="button"
                    key={i}
                    className={`p-1 text-center rounded-full disabled:text-gray-300 ${
                      day ? "hover:bg-theme hover:text-gray-100" : ""
                    } ${
                      new Date(value).getDate() === day &&
                      new Date(value).getMonth() === currentMonth
                        ? "bg-theme text-white"
                        : ""
                    }`}
                    onClick={() =>
                      handleDateSelect(new Date(currentYear, currentMonth, day))
                    }
                    // Disable dates before today or any date before the selected date
                    disabled={
                      (day &&
                        new Date(currentYear, currentMonth, day) <
                          new Date().setHours(0, 0, 0, 0)) ||
                      (name === "dropoffDate" &&
                        new Date(currentYear, currentMonth, day) <
                          new Date(value).setHours(0, 0, 0, 0))
                    }
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Picker Section (Right) */}
          <div className="w-1/3 pl-2">
            <div className="text-center font-semibold">Time</div>
            <div ref={timePickerRef} className="overflow-y-auto max-h-48">
              {generateTimes().map(({ time, isDisabled }, index) => (
                <button
                  type="button"
                  key={index}
                  className={`block w-full text-left p-2 rounded-md disabled:text-gray-400 ${
                    time === formatTimeWithoutSeconds(timeValue)
                      ? "bg-red-500 text-white active"
                      : "hover:bg-red-100"
                  }`}
                  onClick={() => handleTimeSelect(time)}
                  disabled={isDisabled}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
