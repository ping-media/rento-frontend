import bikeImg from "../assets/images/bike-image.png";
import scooterImg from "../assets/images/scooter-image.png";
import CryptoJS from "crypto-js";

const handleErrorImage = (type, ref) => {
  if (type == "gear") {
    ref.current.src = bikeImg;
  } else {
    ref.current.src = scooterImg;
  }
};

const handlePreviousPage = (navigate) => {
  return navigate(-1);
};

const showGreeting = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours();

  let greeting;

  if (hours >= 5 && hours < 12) {
    greeting = "Good Morning";
  } else if (hours >= 12 && hours < 16) {
    greeting = "Good Afternoon";
  } else if (hours >= 16 && hours < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  return greeting;
};

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    import.meta.env.VITE_SECRET_KEY
  ).toString();
};

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedData,
    import.meta.env.VITE_SECRET_KEY
  );
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

// const formatDate = (dateStr) => {
//   const date = new Date(dateStr);

//   const formattedDate = new Intl.DateTimeFormat("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);

//   return formattedDate.replace(/ /g, " ").replace(",", "");
// };

const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  return formattedDate.replace(/^(\w{3}) (\d{2} \w{3} \d{4})$/, "$1, $2");
};

const formatTimeWithoutSeconds = (timeStr) => {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  const seconds = new Date().getSeconds();

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  // if (minutes >= 50) {
  //   hours = (hours + 2) % 24;
  // }
  // Round up to next hour if minutes or seconds > 0
  if (minutes > 0 && seconds > 0) {
    hours = (hours + 1) % 24;
  }

  // Convert back to 12-hour format
  let formattedHour = hours % 12;
  formattedHour = formattedHour === 0 ? 12 : formattedHour;
  const formattedPeriod = hours >= 12 ? "PM" : "AM";

  return `${formattedHour}:00 ${formattedPeriod}`;
};

const formatDateWithDayName = (inputDate) => {
  const date = new Date(inputDate);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  return formatter.format(date);
};

const parseTime = (timeString) => {
  // Get the current date to attach to the time
  const today = new Date();

  // Extract the hours and minutes, and AM/PM part from the timeString
  const [time, modifier] = timeString.split(/(AM|PM)/i); // Split the time by AM/PM
  let [hours, minutes] = time.split(":").map(Number);

  // Adjust hours based on AM/PM
  if (modifier.toLowerCase() === "pm" && hours < 12) {
    hours += 12; // Convert PM hours to 24-hour format
  } else if (modifier.toLowerCase() === "am" && hours === 12) {
    hours = 0; // Convert 12 AM to 00 hours (midnight)
  }

  // Create a new Date object with today's date and the parsed time
  const parsedDate = new Date(today.setHours(hours, minutes, 0, 0)); // Set hours and minutes, reset seconds and milliseconds

  return parsedDate;
};

const handleCheckValidation = (ref, setErrorChanger) => {
  if (ref.current.getAttribute("type") == "number") {
    if (ref.current.value < 10) {
      setErrorChanger("invalid contact number");
    }
  } else {
    setErrorChanger("not a valid contact number");
  }
};

const getDurationInDays = (date1Str, date2Str) => {
  // Parse the input strings into Date objects
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);

  // Check if the dates are valid
  if (isNaN(date1) || isNaN(date2)) {
    return "Invalid date format";
  }

  // Get the difference between the two dates in milliseconds
  const differenceInMs = Math.abs(date2 - date1);

  // Convert milliseconds to days
  const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return days;
};

const formatDateToSlash = (dateStr) => {
  // Parse the input date string into a Date object
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date)) {
    return "Invalid date format";
  }

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits for day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
  const year = date.getFullYear();

  // Return formatted date in "DD/MM/YYYY" format
  return `${day}/${month}/${year}`;
};

// const calculateTax = (amount, taxPercentage) => {
//   // Ensure the inputs are valid numbers
//   if (isNaN(amount) || isNaN(taxPercentage)) {
//     return "Invalid input";
//   }

//   // Calculate the tax based on the given percentage
//   const taxAmount = (taxPercentage / 100) * amount;

//   // Round the result to 2 decimal places and return it
//   return taxAmount.toFixed(2); // This will return a string, but it ensures two decimal places
// };

const calculateTax = (amount, taxPercentage) => {
  // Ensure the inputs are valid numbers
  if (isNaN(amount) || isNaN(taxPercentage)) {
    return "Invalid input";
  }

  // Calculate the tax based on the given percentage
  const taxAmount = (taxPercentage / 100) * amount;

  // Round the result to 2 decimal places and return it
  return parseInt(taxAmount);
};

const convertToISOString = (dropoffDate, dropoffTime) => {
  // Step 1: Parse the date string ("Mon, 02 Dec 2024") into a JavaScript Date object
  const dateParts = dropoffDate.split(",")[1].trim().split(" "); // Remove weekday and split the date part
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = parseInt(dateParts[0], 10);
  const month = monthNames.indexOf(dateParts[1]);
  const year = parseInt(dateParts[2], 10);

  // Create the initial date object in UTC time
  const date = new Date(Date.UTC(year, month, day));

  // Step 2: Parse the time string ("6:00 PM") into 24-hour format
  const timeParts = dropoffTime.split(" ");
  const [hour, minute] = timeParts[0].split(":");
  let hours = parseInt(hour, 10);
  const ampm = timeParts[1];

  // Convert 12-hour time to 24-hour time
  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  // Step 3: Set the time (hours and minutes) in the Date object in UTC
  date.setUTCHours(hours, parseInt(minute, 10), 0, 0);

  // Step 4: Convert the Date object to an ISO string and remove milliseconds
  const isoString = date?.toISOString().slice(0, 19) + "Z";

  return isoString;
};

const removeAfterSecondSlash = (pathname) => {
  // Find the index of the second slash
  const secondSlashIndex = pathname.indexOf("/", pathname.indexOf("/") + 1);

  // If there is no second slash, return the pathname as is
  if (secondSlashIndex === -1) return pathname;

  // Otherwise, slice the pathname up to the second slash
  return pathname.slice(0, secondSlashIndex);
};

// const formatDateTimeForUser = (input) => {
//   const [dateStr, timeStr] = input?.split(" ");

//   // Parse the date string into a Date object
//   const date = new Date(dateStr);

//   // Format the date to the desired format (29 Nov, 2024)
//   const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
//   const formattedDate = date.toLocaleDateString("en-GB", dateOptions);

//   // Format the time to the desired format (5:00 PM)
//   const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

//   // Use UTC methods to get the time in UTC (not local time)
//   const formattedTime = date.toLocaleTimeString("en-GB", {
//     ...timeOptions,
//     timeZone: "UTC",
//   });

//   // Return the formatted string
//   // return `date:${formattedDate} time:${formattedTime}`;
//   return {
//     date: formattedDate,
//     time: formattedTime,
//   };
// };

const formatDateTimeForUser = (input) => {
  const date = new Date(input);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = new Date(Date.UTC(year, month, day)).toLocaleDateString(
    "en-GB",
    dateOptions
  );

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

  const formattedTime = new Date(
    Date.UTC(year, month, day, hours, minutes)
  ).toLocaleTimeString("en-GB", {
    ...timeOptions,
    timeZone: "UTC", // Explicitly use UTC
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
};

const formatDateTimeISTForUser = (input) => {
  const date = new Date(input);

  // Convert to IST
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(date.getTime() + IST_OFFSET);

  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth(); // 0-based index
  const day = istDate.getUTCDate();

  const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = new Date(Date.UTC(year, month, day)).toLocaleDateString(
    "en-GB",
    dateOptions
  );

  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes();
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

  // Format the time as per IST
  const formattedTime = new Date(
    Date.UTC(year, month, day, hours, minutes)
  ).toLocaleTimeString("en-GB", {
    ...timeOptions,
    timeZone: "UTC", // Explicitly use IST offset calculated
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
};

const nextDayFromCurrent = (date, noOfDay = 1) => {
  // const nextDay = date;
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + noOfDay);
  return nextDay;
};

const isValidPhoneNumber = (phone) => {
  const indiaPhoneRegex = /^(?:\+91[-\s]?)?[6-9]\d{9}$/;
  return indiaPhoneRegex.test(phone);
};

const getRoundedDateTime = (value) => {
  // Get the current local date and time
  const currentDate = value;
  const localMinutes = currentDate.getMinutes();
  let roundedMinutes;
  if (localMinutes < 15) {
    roundedMinutes = 0;
  } else if (localMinutes < 45) {
    roundedMinutes = 30;
  } else {
    roundedMinutes = 0;
    currentDate.setHours(currentDate.getHours() + 1); // Increment the hour
  }
  currentDate.setMinutes(roundedMinutes);
  currentDate.setSeconds(0); // Reset seconds to 0
  const utcDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  );
  const isoString = utcDate.toISOString();
  return isoString.split(".")[0] + "Z";
};

const RoundedDateTimeAndToNextHour = (value) => {
  // Get the current local date and time
  const currentDate = new Date(value);

  const localMinutes = currentDate.getMinutes();

  if (localMinutes >= 1) {
    // As soon as minutes turn 01 or more, set to the next full hour
    currentDate.setHours(currentDate.getHours() + 1);
  }

  currentDate.setMinutes(0);
  currentDate.setSeconds(0); // Reset seconds to 0

  const utcDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  );

  return utcDate.toISOString().split(".")[0] + "Z";
};

const addDaysToDate = (dateString, daysToAdd) => {
  const date = new Date(dateString);
  date.setUTCDate(date.getUTCDate() + (daysToAdd - 1));
  return date.toISOString();
};

const camelCaseToSpaceSeparated = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const updateStationId = (location, newId) => {
  const pathSegments = location.pathname.split("/");
  pathSegments[pathSegments.length - 1] = newId;
  const newPathname = pathSegments.join("/");
  const newUrl = `${newPathname}${location.search}`;
  window.history.pushState({}, "", newUrl);
};

const updateQueryParams = (endpoint, _id, queryParmsData) => {
  // Create a new searchParams object
  const params = new URLSearchParams();
  // Loop through the queryParmsData object and append to params
  Object.entries(queryParmsData).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  // Construct the new URL with dynamic query parameters
  const newUrl = `${endpoint}${_id}?${params.toString()}`;
  return newUrl;
};

const isUser18 = (dob) => {
  if (!dob) return false; // Ensure input is not empty or invalid

  // Convert the input DOB string to a Date object
  const birthDate = new Date(dob);

  // Check if the birthDate is valid
  if (isNaN(birthDate)) return false;

  // Get today's date
  const today = new Date();

  // Calculate the user's age
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust the age if the user's birthday hasn't occurred yet this year
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age >= 18;
};

const formatDateTimeComingFromDatabase = (input) => {
  const date = new Date(input);

  // Format the date
  const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", dateOptions);

  return formattedDate;
};

const convertTo24HourFormat = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

const format24HourFormatTime = (hour) => {
  // Validate input
  if (hour < 0 || hour > 23 || isNaN(hour)) {
    throw new Error("Invalid hour. Please provide a number between 0 and 23.");
  }

  // Convert to 12-hour format
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // 12-hour clock (convert 0 to 12)
  return `${formattedHour.toString().padStart(2, "0")}:00 ${period}`;
};

const formatTimeForProductCard = (isoString) => {
  let date = new Date(isoString);

  date.setUTCHours(date.getUTCHours() + 1);

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  // return `${day} ${month}, ${year}, ${hours}:${minutes} ${amPm}`;
  return `${day} ${month}, ${year}, ${hours}:00 ${amPm}`;
};

const addDaysToDateForRide = (daysToAdd, dateStr) => {
  // Split the input date string "Fri, 07 Mar 2025"
  const dateParts = dateStr.split(", ");
  const [day, month, year] = dateParts[1].split(" "); // Extract day, month, and year

  // Map month abbreviation to its number (March -> 3, etc.)
  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  // Create a new Date object using the extracted values
  const date = new Date(year, monthMap[month], parseInt(day));

  // Add the specified number of days to the date
  date.setDate(date.getDate() + daysToAdd);

  // Format the new date back to "Fri, 07 Mar 2025"
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const newDateStr = date.toLocaleDateString("en-GB", options);

  // Return the new formatted date
  return newDateStr;
};

// const searchFormatDateOnly = (dateStr) => new Date(dateStr);
const searchFormatDateOnly = (utcString) => {
  const date = new Date(utcString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const searchFormatTimeOnly = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  }).format(date);
};

const isMinimumDurationHours = (date1, date2, duration = 12) => {
  const msInHour = 60 * 60 * 1000;
  const diffInMs = Math.abs(
    new Date(date1).getTime() - new Date(date2).getTime()
  );

  return diffInMs >= duration * msInHour;
};

// const formatDateMobile = (inputDate) => {
//   // Return early if input is invalid
//   if (!inputDate || typeof inputDate !== "string") return "Invalid Date";

//   try {
//     // Explicitly split and construct the date to avoid any ambiguity
//     const parts = inputDate.trim().split("/");
//     if (parts.length !== 3) return "Invalid Date";

//     // Get month, day, year - explicitly treating as mm/dd/yyyy format
//     const month = parseInt(parts[0], 10) - 1; // 0-indexed months in JS
//     const day = parseInt(parts[1], 10);
//     const year = parseInt(parts[2], 10);

//     // Validate the parts
//     if (isNaN(month) || isNaN(day) || isNaN(year)) return "Invalid Date";
//     if (month < 0 || month > 11 || day < 1 || day > 31) return "Invalid Date";

//     // Create date manually to ensure proper interpretation
//     const date = new Date(year, month, day);

//     // Check if date is valid by verifying the components match what we set
//     if (
//       date.getFullYear() !== year ||
//       date.getMonth() !== month ||
//       date.getDate() !== day
//     ) {
//       return "Invalid Date";
//     }

//     // Format using date-fns with explicit formatting
//     return format(date, "dd MMM yyyy");
//   } catch (error) {
//     console.error("Date formatting error:", error);
//     return "Invalid Date";
//   }
// };

const isSecondTimeSmaller = (time1, time2) => {
  const convertTo24HourFormat = (time) => {
    let [hour, minute, period] = time.match(/(\d+):(\d+) (\w{2})/).slice(1);
    hour = parseInt(hour);
    minute = parseInt(minute);

    if (period.toUpperCase() === "PM" && hour !== 12) {
      hour += 12;
    } else if (period.toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }

    return hour * 60 + minute;
  };

  return convertTo24HourFormat(time2) < convertTo24HourFormat(time1);
};

const validateBookingDates = (startDateTimeStr, endDateTimeStr) => {
  // Parse the ISO datetime strings to Date objects
  const startDateTime = new Date(startDateTimeStr);
  const endDateTime = new Date(endDateTimeStr);
  // Check if end date is after start date
  if (endDateTime <= startDateTime) {
    return {
      valid: false,
      message: "Booking end time must be after booking start time.",
    };
  }
  // Calculate the difference in milliseconds
  const timeDifference = endDateTime - startDateTime;
  // Convert to hours (1000ms * 60s * 60min = 3600000ms per hour)
  const hoursDifference = timeDifference / 3600000;
  // Check if the difference is at least 24 hours
  if (hoursDifference < 24) {
    return {
      valid: false,
      message: "Booking minimum duration should at least 24 hours.",
    };
  }

  return {
    valid: true,
    message: "Booking dates are valid.",
  };
};

const getEarliestDate = (array, key) => {
  return array?.reduce((earliest, item) => {
    const date = item[key] ? new Date(item[key]) : null;
    return !earliest || (date && date < earliest) ? date : earliest;
  }, null);
};

const addOneMinute = (dateTimeString) => {
  const date = new Date(dateTimeString);
  // Add 1 minute (60,000 milliseconds) to the date
  date.setTime(date.getTime() + 60 * 1000);
  return date?.toISOString().split(".")[0] + "Z";
};

const calculatePriceForExtendBooking = (
  perDayCost,
  extensionDays,
  extraAddonPrice = 0
) => {
  const bookingPrice = Number(perDayCost) * Number(extensionDays);
  const AddonPrice = Number(extraAddonPrice);
  const newAddOnPrice = AddonPrice;
  const newBookingPrice = bookingPrice + newAddOnPrice;
  const tax = calculateTax(newBookingPrice, 18);
  const extendAmount = Number(newBookingPrice) + Number(tax);
  return extendAmount;
};

const formatFullDateAndTime = (dateString) => {
  const date = new Date(dateString);
  // Format the date using Intl.DateTimeFormat with short month format
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // Ensure IST time zone
  });
  return formatter.format(date);
};

const addDaysToDateForExtend = (dateString, days) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    throw new Error(
      "Invalid date format. Please use a valid ISO 8601 date string."
    );
  }
  // Add the specified number of days to the date's timestamp
  const updatedDate = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  // Return the updated date in UTC ISO 8601 format
  return updatedDate.toISOString().replace(".000Z", "Z");
};

const convertLocalToUTCISOString = (dateTimeStr) => {
  const localDate = new Date(dateTimeStr);
  if (isNaN(localDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:00Z`;
};

const removeSecondsFromTimeString = (timeStr) => {
  const [time, period] = timeStr.split(" ");
  const [hour, minute] = time.split(":");
  return `${hour}:${minute} ${period}`;
};

const timeStringToMillisecondsWithoutSeconds = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours * 60 + minutes) * 60 * 1000;
};

const updateTimeInISOString = (isoDateStr, newTimeStr) => {
  const [hour, minutePart] = newTimeStr.split(":");
  const [minute, meridian] = minutePart.split(" ");
  let hours = parseInt(hour, 10);

  if (meridian.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (meridian.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  const dateOnly = new Date(isoDateStr);
  dateOnly.setUTCHours(hours, parseInt(minute), 0, 0);

  return dateOnly.toISOString();
};

const calculateTotalAddOnPrice = (addOns, days) => {
  return addOns.reduce((total, item) => {
    const multiplied = item.amount * days;

    const finalAmount =
      item.maxAmount > 0 && multiplied > item.maxAmount
        ? item.maxAmount
        : multiplied;

    return total + finalAmount;
  }, 0);
};

export {
  handleErrorImage,
  handlePreviousPage,
  showGreeting,
  encryptData,
  decryptData,
  formatDate,
  formatTimeWithoutSeconds,
  formatDateWithDayName,
  parseTime,
  handleCheckValidation,
  getDurationInDays,
  formatDateToSlash,
  calculateTax,
  convertToISOString,
  removeAfterSecondSlash,
  formatDateTimeForUser,
  nextDayFromCurrent,
  isValidPhoneNumber,
  getRoundedDateTime,
  addDaysToDate,
  camelCaseToSpaceSeparated,
  formatPrice,
  updateStationId,
  updateQueryParams,
  isUser18,
  formatDateTimeComingFromDatabase,
  convertTo24HourFormat,
  formatDateTimeISTForUser,
  format24HourFormatTime,
  formatTimeForProductCard,
  RoundedDateTimeAndToNextHour,
  addDaysToDateForRide,
  searchFormatDateOnly,
  searchFormatTimeOnly,
  isMinimumDurationHours,
  // formatDateMobile,
  isSecondTimeSmaller,
  validateBookingDates,
  getEarliestDate,
  addOneMinute,
  calculatePriceForExtendBooking,
  formatFullDateAndTime,
  addDaysToDateForExtend,
  convertLocalToUTCISOString,
  removeSecondsFromTimeString,
  timeStringToMillisecondsWithoutSeconds,
  updateTimeInISOString,
  calculateTotalAddOnPrice,
};
