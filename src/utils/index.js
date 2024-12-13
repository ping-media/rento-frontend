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
  let formattedHour = hours % 12; // Convert back to 12-hour format
  formattedHour = formattedHour === 0 ? 12 : formattedHour;
  const formattedMinute = minutes < 10 ? `0${minutes}` : minutes;
  const formattedPeriod = hours >= 12 ? "PM" : "AM";

  return `${formattedHour}:${formattedMinute} ${formattedPeriod}`; // Return the formatted time string
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
  // Create a Date object from the input (ISO 8601 format)
  const date = new Date(input);

  // Extract the UTC date components
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth(); // 0-based index
  const day = date.getUTCDate();

  // Format the date to the desired format (e.g. '11 Dec 2024')
  const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = new Date(Date.UTC(year, month, day)).toLocaleDateString(
    "en-GB",
    dateOptions
  );

  // Extract and format the UTC time components
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

const nextDayFromCurrent = (date) => {
  const nextDay = date;
  nextDay.setDate(nextDay.getDate() + 1); // Increment the day by 1

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

  // Get current local minutes
  const localMinutes = currentDate.getMinutes();

  // Round minutes to the nearest 30
  let roundedMinutes;
  if (localMinutes < 15) {
    roundedMinutes = 0; // Round down to the hour (e.g., 4:00)
  } else if (localMinutes < 45) {
    roundedMinutes = 30; // Round to the next 30 minutes (e.g., 4:30)
  } else {
    roundedMinutes = 0; // Round up to the next hour (e.g., 5:00)
    currentDate.setHours(currentDate.getHours() + 1); // Increment the hour
  }

  // Set the rounded minutes and reset seconds to 0
  currentDate.setMinutes(roundedMinutes);
  currentDate.setSeconds(0); // Reset seconds to 0

  // Convert local time to UTC (by manually adjusting)
  const utcDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  );

  // Convert to ISO string and return the result
  const isoString = utcDate.toISOString();

  // Return the ISO string without milliseconds and 'Z' appended
  return isoString.split(".")[0] + "Z";
};

const addDaysToDate = (dateString, daysToAdd) => {
  // Parse the input date string into a Date object
  const date = new Date(dateString);

  // Add the specified number of days
  date.setUTCDate(date.getUTCDate() + (daysToAdd - 2));

  // Return the new date in ISO string format (with 'Z' indicating UTC time)
  return date.toISOString();
};

const camelCaseToSpaceSeparated = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US").format(price);
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
};
