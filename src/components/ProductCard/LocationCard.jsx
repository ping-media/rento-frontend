import { Link } from "react-router-dom";
import PreLoader from "../skeleton/PreLoader";
import { useEffect, useState } from "react";
import { fetchingData } from "../../Data";
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";

const LocationCard = ({
  stationName,
  stationId,
  stationMasterUserId,
  stationData,
  setStationLoading,
  stationLoading,
}) => {
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [stationUser, setStationUser] = useState([]);
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  // for fetching station master details
  useEffect(() => {
    if (stationMasterUserId) {
      (async () => {
        setStationLoading(true);
        const stationMasterResponse = await fetchingData(
          `/getStationData?stationId=${stationId}`,
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
        className="w-full"
      >
        <div className="w-full mx-auto lg:max-w-lg h-48">
          {!mapError ? (
            <div className="relative w-full h-full">
              {mapLoading && (
                <div className="absolute inset-0 z-10 rounded-lg border flex flex-col items-center justify-center gap-2 bg-background">
                  <Spinner
                    message="Loading map..."
                    customColor="text-gray-400 capitalize"
                  />
                </div>
              )}
              <img
                // src={`https://maps.googleapis.com/maps/api/staticmap?center=${
                //   stationData?.address
                //     ? stationData?.address
                //     : stationUser?.stationData?.city
                // }&zoom=10&size=600x400&markers=color:red|label:A|${
                //   stationData?.latitude || ""
                // },${stationData?.longitude || ""}&key=${
                //   import.meta.env.VITE_MAP_KEY
                // }`}
                src={`${import.meta.env.VITE_BACKEND_URL}/station-map/${stationId}`}
                className="rounded-lg w-full h-full object-cover"
                loading="lazy"
                alt="GOOGLE_MAP"
                onLoad={() => setMapLoading(false)}
                onError={() => {
                  setMapLoading(false);
                  setMapError(true);
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-lg border flex flex-col items-center justify-center gap-2 text-center hover:bg-muted transition-colors">
              <span className="font-medium text-gray-700">
                Map view is currently unavailable
              </span>

              <span className="text-sm text-theme hover:underline">
                Click here to view the location on Google Maps
              </span>
            </div>
          )}
        </div>
      </Link>
      {/* <div className="px-2 py-2 w-full lg:flex-1 text-sm"> */}
      <div className="px-2 py-2 w-full mx-auto lg:max-w-lg text-sm">
        <ul className="leading-8">
          <li className="capitalize w-full break-words">
            <span className="font-bold mr-2 leading-tight">
              Pickup Location:
            </span>
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
              ? `${stationMasterUserId?.firstName || "--"} ${
                  stationMasterUserId?.lastName || "--"
                }`
              : "--"}
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
