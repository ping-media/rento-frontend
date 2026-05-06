import { useEffect, useState } from "react";
import { getPlatform } from "../../utils/platform";
import { useFooter } from "../../hooks/useFooter";
import bannerImage from "../../assets/images/app-banner.webp";
import { useSelector } from "react-redux";

const BottomInstallBanner = () => {
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  const { loading, footerData } = useFooter();
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState("web");

  useEffect(() => {
    if (selectedLocation == null) return;

    const detected = getPlatform();
    setPlatform(detected);

    if (detected === "android" || detected === "ios") {
      setVisible(true);
    }
  }, []);

  if (loading || !visible) return null;

  const appLinks = footerData?.appLink ?? null;
  const storeLink =
    platform === "android" && appLinks !== null
      ? appLinks.android
      : appLinks.ios;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/25"
        onClick={() => setVisible(false)}
      />

      {/* Close button — centered above banner */}
      <div className="relative z-10 flex justify-center mb-3">
        <button
          onClick={() => setVisible(false)}
          className="bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 text-lg shadow"
        >
          ✕
        </button>
      </div>

      {/* Banner */}
      <div className="relative z-10 bg-white shadow-lg rounded-t-2xl overflow-hidden">
        {/* FULL BLEED IMAGE SECTION */}
        <div className="w-full h-62 bg-theme pt-5">
          <img
            src={bannerImage}
            alt="app preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* PADDED CONTENT */}
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2 justify-center -mt-16 bg-white rounded-xl p-4 shadow-md">
            <img
              src="/favicon.ico"
              alt="Rento Bikes"
              className="w-12 h-12 rounded-full object-contain"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Rento Bikes</h3>
            <p className="text-sm text-gray-600">
              Book bikes & cars instantly. Faster, smarter, cheaper.
            </p>
          </div>

          <a
            href={storeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-theme text-white py-2 rounded-lg font-medium"
          >
            Download Now
          </a>

          <button
            onClick={() => setVisible(false)}
            className="text-sm text-gray-500"
          >
            Continue on web
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomInstallBanner;
