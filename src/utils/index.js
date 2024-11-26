import bikeImg from "../assets/images/bike-image.png";
import scooterImg from "../assets/images/scooter-image.png";
import CryptoJS from "crypto-js";
import { clearError, setError } from "../Redux/ErrorSlice/ErrorSlice";
import { handleAsyncError } from "./handleAsyncError";

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

const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  return formattedDate.replace(/ /g, " ").replace(",", "");
};

const formatTimeWithoutSeconds = (timeStr) => {
  // Step 1: Parse the time string into a Date object
  const [time, period] = timeStr.split(" "); // Split time and AM/PM
  let [hours, minutes] = time.split(":").map(Number); // Split hours and minutes

  // Convert to 24-hour time for easier manipulation
  if (period === "PM" && hours !== 12) {
    hours += 12; // Convert PM times except 12 PM to 24-hour format
  } else if (period === "AM" && hours === 12) {
    hours = 0; // Convert 12 AM to 0 hour
  }

  // Step 2: Round the minutes to the nearest half hour
  if (minutes >= 45) {
    minutes = 0; // Round to the next hour if minutes are 45 or greater
    hours = (hours + 1) % 24; // Ensure hours wrap around correctly (i.e., 23 becomes 0)
  } else {
    minutes = 0; // Round down to 00 if minutes are less than 15
  }

  // Step 3: Convert back to 12-hour format and return the time string
  let formattedHour = hours % 12; // Convert back to 12-hour format
  formattedHour = formattedHour === 0 ? 12 : formattedHour; // 0 hour should be 12 in 12-hour format
  const formattedMinute = minutes < 10 ? `0${minutes}` : minutes; // Format minutes
  const formattedPeriod = hours >= 12 ? "PM" : "AM"; // Determine AM/PM period

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

  return taxAmount;
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
};
