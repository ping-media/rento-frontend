const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Stored dates are IST wall-clock values with a "Z" suffix,
// so read the day straight from the UTC fields (no offset added).
export const checkStationWeeklyOff = (station, dateInput) => {
  const weeklyOff = station?.stationWeeklyOff;

  if (weeklyOff === null || weeklyOff === undefined) return { isOff: false };
  if (!dateInput) return { isOff: false };

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return { isOff: false };

  const day = date.getUTCDay();
  if (day !== Number(weeklyOff)) return { isOff: false };

  const dayName = DAY_NAMES[day];
  const nextDayName = DAY_NAMES[(day + 1) % 7];

  return {
    isOff: true,
    dayName,
    message: `Station is closed on ${dayName} (HOLIDAY). Please change the start date to ${nextDayName} or another day.`,
  };
};
