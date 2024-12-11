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
        console.log(result?.data[0]);
        // formatting data for user readability
        setStationUser(result?.data[0]);
        setStationLoading(false);
      })();
    }
  }, [stationMasterUserId]);

  return !stationLoading ? (
    <div className="px-4 py-2 rounded-lg border-2 flex flex-wrap gap-4 mb-3">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.90089943376!2d77.46612593299314!3d12.953945614011557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1731476768845!5m2!1sen!2sin"
        className="w-full lg:w-48 h-48 rounded-lg"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
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
