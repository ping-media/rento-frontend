import { getDurationInDays } from ".";

export const renderTooltipContent = (rides) => {
  if (rides) {
    const totalDays = getDurationInDays(
      rides?.BookingStartDateAndTime,
      rides?.BookingEndDateAndTime
    );

    // If booking is longer than 7 days, show summary using daysBreakdown
    if (totalDays > 7 && rides?.bookingPrice?.daysBreakdown?.length > 0) {
      const totalFromBreakdown = rides.bookingPrice.daysBreakdown.reduce(
        (sum, day) => sum + day.dailyRate,
        0
      );

      // Get rate range
      const rates = rides.bookingPrice.daysBreakdown.map(
        (day) => day.dailyRate
      );
      const minRate = Math.min(...rates);
      const maxRate = Math.max(...rates);
      const avgRate = Math.round(totalFromBreakdown / totalDays);

      return (
        <ul>
          <li>Duration: {totalDays} days</li>
          <li>Total Amount: ₹{totalFromBreakdown}</li>
          <li>
            Rate Range: ₹{minRate} - ₹{maxRate}/day
          </li>
          <li>Average: ₹{avgRate}/day</li>
        </ul>
      );
    }

    // For short bookings (7 days or less), show daily breakdown
    if (rides?.bookingPrice?.daysBreakdown?.length > 0) {
      return (
        <ul>
          {rides.bookingPrice.daysBreakdown.map((day, idx) => (
            <li key={idx}>₹{day?.dailyRate} x 1 day</li>
          ))}
        </ul>
      );
    }

    // Fallback for no breakdown data
    return (
      <ul>
        <li>
          ₹{rides?.bookingPrice?.rentAmount} x {totalDays}{" "}
          {totalDays === 1 ? "day" : "days"}
        </li>
      </ul>
    );
  }
};

export const renderTooltipExtendContent = (rides) => {
  if (rides) {
    const totalDays = getDurationInDays(
      rides?.BookingStartDateAndTime,
      rides?.BookingEndDateAndTime
    );

    if (totalDays > 7 && rides?.daysBreakdown?.length > 0) {
      const totalFromBreakdown = rides.daysBreakdown.reduce(
        (sum, day) => sum + day.dailyRate,
        0
      );

      // Get rate range
      const rates = rides.daysBreakdown.map((day) => day.dailyRate);
      const minRate = Math.min(...rates);
      const maxRate = Math.max(...rates);
      const avgRate = Math.round(totalFromBreakdown / totalDays);

      return (
        <ul>
          <li>Duration: {totalDays} days</li>
          <li>Total Amount: ₹{totalFromBreakdown}</li>
          <li>
            Rate Range: ₹{minRate} - ₹{maxRate}/day
          </li>
          <li>Average: ₹{avgRate}/day</li>
        </ul>
      );
    }

    if (rides?.daysBreakdown?.length > 0) {
      return (
        <ul>
          {rides.daysBreakdown.map((day, idx) => (
            <li key={idx}>₹{day?.dailyRate} x 1 day</li>
          ))}
        </ul>
      );
    }

    return (
      <ul>
        <li>
          ₹{rides?.amount} x {totalDays} {totalDays === 1 ? "day" : "days"}
        </li>
      </ul>
    );
  }
};

export const renderTooltipBreakdown = (appliedPlans, daysBreakDown) => {
  const weekend =
    daysBreakDown?.length > 0
      ? daysBreakDown.filter((day) => day.isWeekend === true)
      : [];
  const weekDays =
    daysBreakDown?.length > 0
      ? daysBreakDown.filter((day) => day.isWeekend === false)
      : [];

  return (
    <ul>
      {appliedPlans?.length > 0 && (
        <li>
          <span className="font-semibold mr-1">
            {appliedPlans[0]?.days} Days Package:
          </span>
          ₹{appliedPlans[0]?.planPrice}{" "}
          {appliedPlans[0]?.count > 1 && `x ${appliedPlans[0]?.count}`}
        </li>
      )}
      {weekend?.length > 0 && (
        <li>
          <span className="font-semibold mr-1">Weekend:</span>₹
          {weekend[0]?.dailyRate} x {weekend?.length}
        </li>
      )}
      {weekDays?.length > 0 && (
        <li>
          <span className="font-semibold mr-1">Week:</span>₹
          {weekDays[0]?.dailyRate} x {weekDays?.length}
        </li>
      )}
    </ul>
  );
};
