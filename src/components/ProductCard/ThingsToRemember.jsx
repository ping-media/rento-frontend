import { camelCaseToSpaceSeparated } from "../../utils";
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
    distanceLimit: {
      limit: rides?.vehicleBasic?.freeLimit,
      message:
        "Utilise the total distance limit of the package as per your will all kms in a day or some kms per day.",
    },
    excessCharge: {
      limit: rides?.vehicleBasic?.extraKmCharge,
      message:
        "Extra charges are applicable if the distance limit exceeds the package.",
    },
    lateFee: {
      limit: rides?.vehicleBasic?.lateFee,
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
                  ? `${value?.limit} Km/hr`
                  : key.includes("Otp")
                  ? value?.limit
                  : `₹ ${value?.limit || 0}/hr`}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ThingsToRemember;
