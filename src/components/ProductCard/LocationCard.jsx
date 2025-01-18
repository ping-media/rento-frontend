import { Link } from "react-router-dom";
import PreLoader from "../skeleton/PreLoader";
import { useEffect, useState } from "react";
import { fetchingData } from "../../Data";

const LocationCard = ({
  stationName,
  stationId,
  stationMasterUserId,
  setStationLoading,
  stationLoading,
}) => {
  const [stationUser, setStationUser] = useState([]);
  // for fetching station master details
  useEffect(() => {
    if (stationMasterUserId) {
      (async () => {
        setStationLoading(true);
        const stationMasterResponse = await fetchingData(
          `/getStationData?stationId=${stationId}`
        );
        // formatting data for user readability
        setStationUser({
          stationData: stationMasterResponse?.data[0],
        });
        setStationLoading(false);
      })();
    }
  }, [stationMasterUserId]);

  return !stationLoading ? (
    <div className="px-4 py-2 rounded-lg border-2 flex flex-wrap gap-4 mb-3">
      <Link
        to={`https://www.google.com/maps/search/?api=1&query=${stationUser?.stationData?.latitude},${stationUser?.stationData?.longitude}`}
        target="_blank"
      >
        <div className="w-full lg:w-48 h-48">
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${
              stationUser?.stationData?.city
            }k&zoom=10&size=600x400&markers=color:red|label:A|40.7128,-74.0060&key=${
              import.meta.env.VITE_MAP_KEY
            }`}
            className="rounded-lg w-full h-full object-cover"
            loading="lazy"
            alt="GOOGLE_MAP"
          />
        </div>
      </Link>
      <div className="px-4 py-2 w-full lg:w-auto text-sm">
        <ul className="leading-8">
          <li className="capitalize">
            <span className="font-bold mr-2">Pickup Location:</span>
            {stationName}
          </li>
          <li className="capitalize">
            <span className="font-bold mr-2">LandMark:</span>
            {stationName}
          </li>
          <li className="capitalize">
            <span className="font-bold mr-2">Manager Name:</span>
            {stationUser
              ? `${stationMasterUserId?.firstName} ${stationMasterUserId?.lastName}`
              : "Test User"}
          </li>
          <li>
            <span className="font-bold mr-2">Manager Phone Number:</span>
            <Link
              className="text-blue-400 hover:underline"
              to={`tel:${stationMasterUserId?.contact || "xxxxxxxxxx"}`}
            >
              {stationMasterUserId?.contact || "xxxxxxxxxx"}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <PreLoader />
  );
};

export default LocationCard;
