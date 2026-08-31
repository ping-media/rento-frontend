import { useDispatch, useSelector } from "react-redux";
import { toggleLocationModal } from "../../Redux/ModalSlice/ModalSlice";
import {
  addingLocation,
  addLocation,
  handleCheckLocationChange,
} from "../../Redux/LocationSlice/LocationSlice";
import { useEffect, useRef, useState } from "react";
import { fetchingData } from "../../Data";
import Spinner from "../Spinner/Spinner";
import Location from "../../assets/logo/location.webp";
import useOutsideClick from "../../hooks/useOutsideClick";

const LocationModal = () => {
  const dispatch = useDispatch();
  const { isLocationModalActive } = useSelector((state) => state.modals);
  const [loading, setLoading] = useState(false);
  const [locationList, setLocationList] = useState([]);

  const modalRef = useRef(null);

  const onClose = () => {
    dispatch(toggleLocationModal());
  };

  useOutsideClick(modalRef, onClose, isLocationModalActive);

  // for changing the location when click on location
  const handleChangeLocation = (value) => {
    if (value) {
      dispatch(addingLocation());
      dispatch(addLocation(value));
      dispatch(toggleLocationModal());
      location.pathname.includes("/search/") &&
        dispatch(handleCheckLocationChange());
    }
  };

  //  setting the default location for new user
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const result = await fetchingData("/getLocation");

      if (result?.status === 200) {
        setLocationList(result.data);
      } else {
        setLocationList([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let hasRun = false;
    if (!hasRun) {
      fetchLocations();
      hasRun = true;
    }
  }, []);

  return (
    <>
      <div
        className={`fixed ${
          !isLocationModalActive && "hidden"
        } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto w-full h-full px-4`}
      >
        <div
          className="relative top-20 mx-auto shadow-xl rounded bg-white max-w-2xl"
          ref={modalRef}
        >
          <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
            <h2 className="font-bold text-2xl uppercase">
              Choose <span className="text-theme">Location</span>
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              aria-label="close modal"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div className="p-6 pt-5 text-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-6 lg:gap-4 w-full overflow-hidden h-96 overflow-y-auto no-scrollbar">
              {!loading ? (
                locationList?.length > 0 ? (
                  locationList.map((item) => (
                    <button
                      className="w-full h-32 lg:h-40"
                      onClick={() =>
                        handleChangeLocation({
                          locationName: item?.locationName,
                          locationId: item?._id,
                        })
                      }
                      key={item?._id}
                    >
                      <img
                        src={item?.locationImage}
                        className="w-full h-full object-cover rounded-lg border-2 shadow-lg p-0.5 hover:scale-95 transition-all duration-200 ease-in-out"
                        loading="lazy"
                        alt="SEARCH_LOCATION"
                      />
                      {/* <h2 className="text-gray-600 font-semibold capitalize mt-2">
                        {item?.locationName}
                      </h2> */}
                    </button>
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center h-full">
                    <div>
                      <img
                        src={Location}
                        className="w-24 h-24 mx-auto object-contain"
                        loading="lazy"
                        alt="LOCATION"
                      />
                      <p className="text-center font-semibold italic text-gray-500">
                        No Location Found.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center col-span-full">
                  <Spinner
                    customColor={"text-black uppercase"}
                    message={"loading.."}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationModal;
