import { camelCaseToSpaceSeparated, formatPrice } from "../../utils";
import CopyButton from "../Button/CopyButton";

const ThingsToRemember = ({ rides }) => {
  const thingsToRemember = {
    StartOtp: {
      limit: rides?.vehicleBasic?.startRide,
      message: "OTP to start ride",
    },
    EndOtp: {
      limit: rides?.vehicleBasic?.endRide,
      message: "OTP to end ride",
    },
    refundableDeposit: {
      limit: rides?.vehicleBasic?.refundableDeposit,
      message: "need to pay at pickup and will be refunded after drop",
    },
    distanceLimit: {
      limit: rides?.vehicleBasic?.freeLimit,
      message:
        "Utilise the total distance limit of the package as per your will all kms in a day or some kms per day.",
    },
    excessCharge: {
      limit: formatPrice(Number(rides?.vehicleBasic?.extraKmCharge)),
      message:
        "Extra charges are applicable if the distance limit exceeds the package.",
    },
    lateFee: {
      limit: formatPrice(Number(rides?.vehicleBasic?.lateFee)),
      message: "Be sure to drop the vehicle in time to avoid any charges.",
    },
    speedLimit: {
      limit: rides?.vehicleBasic?.speedLimit,
      message: "Keep the speed within mentioned limits for safe travels.",
    },
  };

  return (
    <>
      <ul className="w-full leading-8">
        {Object.entries(thingsToRemember).map(([key, value]) => {
          if (value?.limit == 0) {
            return null;
          }
          return (
            <li key={key} className="flex items-center justify-between">
              <div className="w-[75%]">
                <p className="font-semibold uppercase">
                  {camelCaseToSpaceSeparated(key)}
                </p>
                <p className="text-xs text-gray-500 mb-1">({value?.message})</p>
              </div>{" "}
              <p
                className={`text-right w-auto ${
                  key.includes("Otp") ? "font-bold" : ""
                }`}
              >
                {key.includes("Otp") && (
                  <CopyButton textToCopy={value?.limit} />
                )}
                {key.includes("Limit")
                  ? key.includes("speed")
                    ? `${value?.limit} km/hour`
                    : `${value?.limit} Km/day`
                  : key.includes("Otp")
                  ? value?.limit
                  : key.includes("late")
                  ? `₹ ${value?.limit || 0}/hour`
                  : key.includes("refundable")
                  ? `₹${formatPrice(value?.limit || 0)}`
                  : `₹ ${value?.limit || 0}/km`}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ThingsToRemember;
