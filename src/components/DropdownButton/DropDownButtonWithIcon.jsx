import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
// import { searchLocationList } from "../../Data/dummyData";

const DropDownButtonWithIcon = ({ labelId, containerOnTop }) => {
  const [isOpened, setIsOpened] = useState(false);
  const { loading, station } = useSelector((state) => state.station);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueId, setSelectedValueId] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      if (station.length > 0) {
        setSelectedValue(station[0]?.stationName);
        setSelectedValueId(station[0]?.stationId);
      } else {
        setSelectedValue("No Station Found");
      }
    }
  }, [loading]);

  const handleLocationChange = (id, value) => {
    setSelectedValueId(id);
    setSelectedValue(value);
  };

  // for closing dropdown menu when user click outside anywhere on screen
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpened(false);
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <button
      className="border-2 px-5 py-3 lg:3.5 focus:border-theme rounded-lg relative w-full"
      onClick={() => setIsOpened(!isOpened)}
      type="button"
      id={labelId}
      disabled={!loading && station?.length > 0 ? false : true}
      ref={dropdownRef}
    >
      <input type="hidden" name={labelId} value={selectedValueId || ""} />
      <div>
        <div className="flex items-center justify-between gap-2 truncate">
          <div className="flex items-center gap-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
              </svg>
            </span>
            <span>{selectedValue}</span>
          </div>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 ${isOpened && "rotate-180"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
        {isOpened && (
          <div
            className={`absolute z-40 left-0 bg-white w-full transition duration-200 ease-in-out border rounded-lg max-h-32 overflow-hidden hover:overflow-y-auto ${
              !containerOnTop ? "bottom-14" : "top-14"
            }`}
          >
            <ul className="py-1">
              {!loading ? (
                station.length > 0 ? (
                  station.map((item) => (
                    <li
                      key={item?.stationId}
                      className="w-full text-left py-1 hover:bg-gray-300 hover:bg-opacity-50 px-6 py-3"
                      onClick={() => {
                        handleLocationChange(
                          item?.stationId,
                          item?.stationName
                        );
                      }}
                    >
                      {item?.stationName}
                    </li>
                  ))
                ) : (
                  <li className="w-full text-left py-1 hover:bg-gray-300 hover:bg-opacity-50 px-6 py-3">
                    No Station Found
                  </li>
                )
              ) : (
                <li className="animate-pulse">
                  <Spinner message={"loading.."} />
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </button>
  );
};

export default DropDownButtonWithIcon;
