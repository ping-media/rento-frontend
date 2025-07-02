import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  formatDate,
  formatTimeWithoutSeconds,
  nextDayFromCurrent,
  parseTime,
} from "../../utils";
import { useSelector } from "react-redux";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const DatePicker = ({
  value,
  name,
  setValueChanger,
  setDropoffChanger,
  timeValue,
  setTimeValueChanger,
  setDropTimeValueChanger,
}) => {
  const datePickerRef = useRef(null);
  const timePickerRef = useRef(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const { selectedStation } = useSelector((state) => state.station);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [minDate, setMinDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const isExplorePage = location.pathname?.includes("/explore");

  const availableTimes = useMemo(() => {
    const times = [];
    const today = new Date();
    const selectedDate = new Date(value);
    const isToday = selectedDate.toDateString() === today.toDateString();
    const now = new Date();

    for (let hour = 0; hour < 24; hour++) {
      // for (let minute = 0; minute < 60; minute += 60) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour < 12 ? "AM" : "PM";
        const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
        const hourString = adjustedHour;
        const minuteString = minute < 10 ? `0${minute}` : minute;
        const timeString = `${hourString}:${minuteString} ${period}`;
        const timeDate = parseTime(timeString);

        const isOutsideAllowedRange =
          hour < selectedStation?.openStartTime ||
          hour > selectedStation?.openEndTime;

        let isDisabled = false;

        if (isExplorePage) {
          const currentMins = now.getHours() * 60 + now.getMinutes();
          const timeMins = timeDate.getHours() * 60 + timeDate.getMinutes();
          isDisabled = timeMins < currentMins;
        } else {
          isDisabled = (isToday && timeDate < now) || isOutsideAllowedRange;
        }

        times.push({ time: timeString, isDisabled });
      }
    }
    return times;
  }, [value, selectedStation]);

  const handleDateSelect = (date) => {
    if (!date) return;
    setValueChanger(date);
    if (setDropoffChanger && name === "pickup") {
      const tempDropoffDate = nextDayFromCurrent(date);
      setDropoffChanger(tempDropoffDate);
    }
  };

  const handleTimeSelect = (time) => {
    setTimeValueChanger(time);
    if (setDropTimeValueChanger && name === "pickup") {
      setDropTimeValueChanger(time);
    }
    setCalendarVisible(false);
  };

  const handleClickOutside = (event) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      setCalendarVisible(false);
    }
  };

  const checkDropdownPosition = () => {
    if (datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    if (calendarVisible) checkDropdownPosition();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarVisible]);

  useEffect(() => {
    if (!selectedStation) return;

    const now = new Date();
    const currentHour = now.getHours();
    const openEndTime = Number(selectedStation?.openEndTime);

    if (currentHour >= openEndTime) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setMinDate(tomorrow.toISOString().split("T")[0]);
    } else {
      setMinDate(new Date().toISOString().split("T")[0]);
    }
  }, [selectedStation]);

  useEffect(() => {
    if (calendarVisible && timePickerRef.current) {
      const activeButton = timePickerRef.current.querySelector(".active");
      if (activeButton) {
        timePickerRef.current.scrollTop =
          activeButton.offsetTop - timePickerRef.current.offsetTop;
      }
    }
  }, [calendarVisible, timeValue]);

  return (
    <div className="relative" ref={datePickerRef}>
      <button
        type="button"
        className="flex items-center justify-between border-2 px-1.5 py-2.5 focus:border-theme rounded-lg relative w-full"
        onClick={() => setCalendarVisible(!calendarVisible)}
      >
        <div className="w-full flex items-center justify-between gap-0.5">
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

      {calendarVisible && (
        <div
          className={`absolute bg-white shadow-md rounded-md mt-1 z-30 lg:z-10 border border-gray-300 w-full lg:w-96 p-2 flex ${
            dropdownPosition === "top" ? "bottom-full mb-2" : "top-full"
          }`}
        >
          {/* Calendar */}
          <div className="w-2/3 border-r pr-1">
            <DayPicker
              selected={new Date(value)}
              onSelect={handleDateSelect}
              minDate={new Date(minDate)}
              disabled={{ before: new Date(minDate) }}
              mode="single"
              modifiersClassNames={{
                selected: "bg-theme text-white rounded-full",
                today: "text-red-500",
                disabled: "text-gray-400",
              }}
              className="w-full overflow-hidden"
            />
          </div>

          {/* Time Picker */}
          <div className="w-1/3 pl-1">
            <div className="text-center font-semibold">Time</div>
            <div ref={timePickerRef} className="overflow-y-auto max-h-48">
              {availableTimes.map(({ time, isDisabled }, index) => (
                <button
                  key={index}
                  type="button"
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
