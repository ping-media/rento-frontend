import React, { useState, useEffect, useRef } from "react";
import { formatDate } from "../../utils";

const DatePicker = ({ containerOnTop, value, name }) => {
  const datePickerRef = useRef(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  // Current date to generate the calendar
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // Render the calendar for the current month
  const renderCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay(); // 0 = Sunday, 6 = Saturday

    // Build the days grid for the calendar
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null); // Empty spaces for the first row
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Handle selecting a date
  const handleDateSelect = (date) => {
    if (name == "dropoffDate") {
      setDropoffDate(date);
    } else {
      setPickupDate(date);
    }
    setCalendarVisible(false);
  };

  // Change the month
  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
      setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
    } else {
      setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
      setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
    }
  };

  // update the dropoffDate when pickup value change
  // const handleChangeDate = (name, dateValue) => {
  //   if (name === "pickupDate") {
  //     const newValue = new Date(dateValue);
  //     newValue.setDate(newValue.getDate() + 1);
  //     if (!isNaN(newValue)) {
  //       setDropoffDate(newValue);
  //     }
  //   } else if (name === "dropoffDate") {
  //     setDropoffDate(dateValue);
  //   }
  // };

  // update pickup date with current date
  useEffect(() => {
    setPickupDate(new Date(value));
    setDropoffDate(new Date(value));
  }, []);

  useEffect(() => {}, [pickupDate]);

  // for closing dropdown menu when user click outside anywhere on screen
  const handleClickOutside = (event) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      setCalendarVisible(false);
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

  return (
    <div className="relative" ref={datePickerRef}>
      <button
        type="button"
        className="flex items-center justify-between border-2 px-5 py-3 lg:3.5 focus:border-theme rounded-lg relative w-full rounded-lg"
        onClick={() => setCalendarVisible(!calendarVisible)}
      >
        <div className="inline-flex items-center gap-2">
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
            placeholder="Select date"
            value={
              name == "pickupDate"
                ? formatDate(pickupDate)
                : formatDate(dropoffDate)
            }
            readOnly
            name={name}
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
      {/* Calendar */}
      {calendarVisible && (
        <div
          className={`absolute bg-white shadow-md rounded-md mt-1 z-50 border border-gray-300 w-full lg:w-72 ${
            !containerOnTop && "mt-[-23rem]"
          }`}
        >
          <div className="flex justify-between items-center p-2 border-b">
            <button
              onClick={() => handleMonthChange("prev")}
              className="text-gray-500 hover:text-theme"
              type="button"
              disabled={new Date().getMonth() == currentMonth ? true : false}
            >
              &lt;
            </button>
            <span className="text-gray-700 font-semibold">
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
              })}{" "}
              {currentYear}
            </span>
            <button
              onClick={() => handleMonthChange("next")}
              className="text-gray-500 hover:text-theme"
              type="button"
            >
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 p-2">
            {/* Days of the week */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm text-gray-500">
                {day}
              </div>
            ))}

            {/* Days */}
            {renderCalendar().map((day, idx) => (
              <button
                key={idx}
                className={`p-2 text-center rounded-full disabled:text-gray-300 ${
                  day ? "hover:bg-theme hover:text-gray-100" : ""
                } ${
                  name == "pickupDate"
                    ? pickupDate.getDate() === day &&
                      pickupDate.getMonth() === currentMonth
                      ? "bg-theme text-white"
                      : ""
                    : dropoffDate.getDate() === day &&
                      dropoffDate.getMonth() === currentMonth
                    ? "bg-theme text-white"
                    : ""
                }`}
                onClick={() =>
                  day &&
                  handleDateSelect(new Date(currentYear, currentMonth, day))
                }
                disabled={
                  (day &&
                    new Date(currentYear, currentMonth, day) <
                      new Date().setHours(0, 0, 0, 0)) ||
                  // (selectedDate &&
                  //   new Date(currentYear, currentMonth, day) < selectedDate)
                  (name === "dropoffDate" &&
                    new Date(currentYear, currentMonth, day) < dropoffDate)
                }
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
