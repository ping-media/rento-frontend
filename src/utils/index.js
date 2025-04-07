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
  } else if (hours >= 12 && hours < 17) {
    greeting = "Good Afternoon";
  } else if (hours >= 17 && hours < 21) {
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

// const formatTimeWithoutSeconds = (timeStr) => {
//   // Step 1: Parse the time string into a Date object
//   const [time, period] = timeStr.split(" "); // Split time and AM/PM
//   let [hours, minutes] = time.split(":").map(Number); // Split hours and minutes

//   // Convert to 24-hour time for easier manipulation
//   if (period === "PM" && hours !== 12) {
//     hours += 12; // Convert PM times except 12 PM to 24-hour format
//   } else if (period === "AM" && hours === 12) {
//     hours = 0; // Convert 12 AM to 0 hour
//   }

//   // Step 2: Round the minutes to the nearest half hour
//   if (minutes >= 45) {
//     minutes = 0; // Round to the next hour if minutes are 45 or greater
//     hours = (hours + 1) % 24; // Ensure hours wrap around correctly (i.e., 23 becomes 0)
//   } else {
//     minutes = 0; // Round down to 00 if minutes are less than 15
//   }

//   // Step 3: Convert back to 12-hour format and return the time string
//   let formattedHour = hours % 12; // Convert back to 12-hour format
//   formattedHour = formattedHour === 0 ? 12 : formattedHour; // 0 hour should be 12 in 12-hour format
//   const formattedMinute = minutes < 10 ? `0${minutes}` : minutes; // Format minutes
//   const formattedPeriod = hours >= 12 ? "PM" : "AM"; // Determine AM/PM period

//   return `${formattedHour}:${formattedMinute} ${formattedPeriod}`; // Return the formatted time string
// };

const formatTimeWithoutSeconds = (timeStr) => {
  // Step 1: Parse the time string into a Date object
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Convert to 24-hour time for easier manipulation
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  // Step 2: Round the minutes to the nearest hour
  if (minutes > 0) {
    minutes = 0;
    hours = (hours + 1) % 24;
  }
  // Step 3: Convert back to 12-hour format and return the time string
  let formattedHour = hours % 12;
  formattedHour = formattedHour === 0 ? 12 : formattedHour;
  const formattedMinute = minutes < 10 ? `0${minutes}` : minutes;
  const formattedPeriod = hours >= 12 ? "PM" : "AM";

  return `${formattedHour}:${formattedMinute} ${formattedPeriod}`;
};

const formatDateWithDayName = (inputDate) => {
  const date = new Date(inputDate);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short", // "Sat"
    day: "2-digit", // "16"
    month: "short", // "Nov"
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

const calculateTax = (amount, taxPercentage) => {
  // Ensure the inputs are valid numbers
  if (isNaN(amount) || isNaN(taxPercentage)) {
    return "Invalid input";
  }

  // Calculate the tax based on the given percentage
  const taxAmount = (taxPercentage / 100) * amount;

  // Round the result to 2 decimal places and return it
  return taxAmount.toFixed(2); // This will return a string, but it ensures two decimal places
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

  const day = parseInt(dateParts[0], 10); // Convert day to integer
  const month = monthNames.indexOf(dateParts[1]); // Get the month index
  const year = parseInt(dateParts[2], 10); // Convert year to integer

  // Create the initial date object in UTC time
  const date = new Date(Date.UTC(year, month, day));

  // Step 2: Parse the time string ("6:00 PM") into 24-hour format
  const timeParts = dropoffTime.split(" ");
  const [hour, minute] = timeParts[0].split(":"); // Split the time into hour and minute
  let hours = parseInt(hour, 10); // Convert hour to integer
  const ampm = timeParts[1]; // AM or PM

  // Convert 12-hour time to 24-hour time
  if (ampm === "PM" && hours !== 12) {
    hours += 12; // Convert PM hour to 24-hour format, except for 12 PM (noon)
  } else if (ampm === "AM" && hours === 12) {
    hours = 0; // 12 AM is midnight, so set hours to 0
  }

  // Step 3: Set the time (hours and minutes) in the Date object in UTC
  date.setUTCHours(hours, parseInt(minute, 10), 0, 0); // Set the time (hours, minutes, seconds, milliseconds)

  // Step 4: Convert the Date object to an ISO string and remove milliseconds
  const isoString = date.toISOString().slice(0, 19) + "Z"; // Remove milliseconds and append 'Z' for UTC

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
  const month = date.getUTCMonth(); // 0-based index
  const day = date.getUTCDate();

  const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = new Date(Date.UTC(year, month, day)).toLocaleDateString(
    "en-GB",
    dateOptions
  );

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

  // Format the time as per the desired format (e.g. '10:00 pm')
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
  const nextDay = date;
  nextDay.setDate(nextDay.getDate() + noOfDay);

  // return nextDay.toLocaleDateString();
  return nextDay;
};

const isValidPhoneNumber = (phone) => {
  const indiaPhoneRegex = /^(?:\+91[-\s]?)?[789]\d{9}$/;
  // Test the phone number against the regex
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
  return new Intl.NumberFormat("en-US", {
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

  hours = hours % 12 || 12; // Convert 24-hour to 12-hour format

  return `${day} ${month}, ${year}, ${hours}:${minutes} ${amPm}`;
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

const searchFormatDateOnly = (dateStr) => new Date(dateStr);

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

const formatDateMobile = (inputDate) => {
  if (!inputDate || typeof inputDate !== "string") return "Invalid Date";

  const parts = inputDate.split("/");
  if (parts.length !== 3) return "Invalid Date";

  const [month, day, year] = parts;
  const dateObj = new Date(year, month - 1, day);

  return dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

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
  formatDateMobile,
  isSecondTimeSmaller,
  validateBookingDates,
};
