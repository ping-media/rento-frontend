import { Link } from "react-router-dom";
import PreLoader from "../skeleton/PreLoader";
import { useEffect, useState } from "react";
import { fetchingData } from "../../Data";

const LocationCard = ({
  stationName,
  stationMasterUserId,
  setStationLoading,
  stationLoading,
}) => {
  const [stationUser, setStationUser] = useState(null);
  // for fetching station master details
  useEffect(() => {
    if (stationMasterUserId) {
      (async () => {
        setStationLoading(true);
        const result = await fetchingData(
          `/getAllUsers?_id=${stationMasterUserId}`
        );
        // formatting data for user readability
        setStationUser(result?.data[0]);
        setStationLoading(false);
      })();
    }
  }, [stationMasterUserId]);

  return !stationLoading ? (
    <div className="px-4 py-2 rounded-lg border-2 flex flex-wrap gap-4 mb-3">
      <div className="w-full lg:w-48 h-48">
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=New+York&zoom=10&size=600x400&markers=color:red|label:A|40.7128,-74.0060&key=${
            import.meta.env.VITE_MAP_KEY
          }`}
          className="rounded-lg w-full h-full object-cover"
          alt=""
        />
      </div>
      <div className="px-4 py-2 w-full lg:w-auto text-sm">
        <ul className="leading-8">
          <li>
            <span className="font-bold mr-2">Pickup Location:</span>
            {stationName}
          </li>
          <li>
            <span className="font-bold mr-2">LandMark:</span>
            {stationName}
          </li>
          <li>
            <span className="font-bold mr-2">Person Name:</span>
            {stationUser
              ? `${stationUser?.firstName} ${stationUser?.lastName}`
              : "Test User"}
          </li>
          <li>
            <span className="font-bold mr-2">Mobile Number:</span>
            <Link
              className="text-blue-400 hover:underline"
              to={`tel:${stationUser ? stationUser?.contact : "xxxxxxxxxx"}`}
            >
              {stationUser ? stationUser?.contact : "xxxxxxxxxx"}
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
