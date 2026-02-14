import Spinner from "../Spinner/Spinner";
import newFullLightImg from "../../assets/rento-full-light.webp";

const PreLoader = ({ showLogo = false }) => {
  return (
    <div
      id="loading-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 ${showLogo ? "flex-col gap-3.5" : ""}`}
    >
      {showLogo && (
        <div className="h-9 lg:h-12">
          <img
            src={newFullLightImg}
            className="w-full h-full object-contain"
            alt="RENTOBIKES_LOGO"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      )}

      <Spinner />
    </div>
  );
};

export default PreLoader;
