import { Link } from "react-router-dom";
import PreLoader from "../skeleton/PreLoader";
import { useEffect, useState } from "react";
import { fetchingData } from "../../Data";
import { useSelector } from "react-redux";

const LocationCard = ({
  stationName,
  stationId,
  stationMasterUserId,
  stationData,
  setStationLoading,
  stationLoading,
}) => {
  const [stationUser, setStationUser] = useState([]);
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  // for fetching station master details
  useEffect(() => {
    if (stationMasterUserId) {
      (async () => {
        setStationLoading(true);
        const stationMasterResponse = await fetchingData(
          `/getStationData?stationId=${stationId}`
        );
        setStationUser({
          stationData: stationMasterResponse?.data[0],
        });
        setStationLoading(false);
      })();
    }
  }, [stationMasterUserId]);

  return !stationLoading ? (
    <div className="px-4 py-2 rounded-lg border-2 flex flex-wrap w-full mx-auto gap-4 mb-3">
      <Link
        to={
          stationData?.mapLink
            ? stationData?.mapLink
            : `https://www.google.com/maps/place/${stationData?.latitude},${stationData?.longitude}`
        }
        target="_blank"
      >
        <div className="w-full lg:w-48 h-48">
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${
              stationData?.address
                ? stationData?.address
                : stationUser?.stationData?.city
            }&zoom=10&size=600x400&markers=color:red|label:A|${
              stationData?.latitude || ""
            },${stationData?.longitude || ""}&key=${
              import.meta.env.VITE_MAP_KEY
            }`}
            className="rounded-lg w-full h-full object-cover"
            loading="lazy"
            alt="GOOGLE_MAP"
          />
        </div>
      </Link>
      <div className="px-2 py-2 w-full lg:flex-1 text-sm">
        <ul className="leading-8">
          <li className="capitalize w-full break-words">
            <span className="font-bold mr-2">Pickup Location:</span>
            {stationData?.address ||
              stationName ||
              selectedLocation?.locationName ||
              ""}
          </li>
          <li className="capitalize">
            <span className="font-bold mr-2">LandMark:</span>
            {stationData?.stationName ||
              stationName ||
              selectedLocation?.locationName ||
              ""}
          </li>
          <li className="capitalize">
            <span className="font-bold mr-2">Full Name:</span>
            {stationUser
              ? `${stationMasterUserId?.firstName} ${stationMasterUserId?.lastName}`
              : "Test User"}
          </li>
          <li className="flex items-center gap-1">
            <span className="font-bold mr-2">Contact:</span>
            <div className="flex items-center gap-1">
              <Link
                className="text-blue-400 hover:underline"
                to={`tel:${stationMasterUserId?.contact || "--"}`}
              >
                {stationMasterUserId?.contact || "--"}
              </Link>
              {stationMasterUserId?.altContact && (
                <>
                  <span>,</span>
                  <Link
                    className="text-blue-400 hover:underline"
                    to={`tel:${stationMasterUserId?.altContact || "--"}`}
                  >
                    {stationMasterUserId?.altContact || "--"}
                  </Link>
                </>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <PreLoader />
  );
};

export default LocationCard;
