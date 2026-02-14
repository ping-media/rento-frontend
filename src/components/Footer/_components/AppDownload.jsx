import React, { useMemo } from "react";
import playStore from "../../../assets/playStore.webp";
import appleStore from "../../../assets/appleStore.webp";
import { Link } from "react-router-dom";

const STORE_LOGO = {
  android: playStore,
  ios: appleStore,
};

const isValidLink = (url) =>
  typeof url === "string" && url.trim() !== "" && url !== "#";

const AppDownload = React.memo(({ link }) => {
  // changing object data into array and also adding the images
  const validStores = useMemo(() => {
    if (!link || typeof link !== "object") return [];

    return Object.entries(link).filter(([, url]) => isValidLink(url));
  }, [link]);

  if (!validStores.length) return null;

  return (
    <div>
      <p className="text-gray-100 text-base">
        Download the app by clicking the link below:
      </p>

      <div className="flex gap-4 mt-4">
        {validStores.map(([platform, url]) => (
          <Link
            key={platform}
            to={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-36"
          >
            <img
              src={STORE_LOGO[platform]}
              alt={`${platform} store`}
              className="w-full h-full object-contain hover:scale-105 transition-transform"
            />
          </Link>
        ))}
      </div>
    </div>
  );
});

export default AppDownload;
