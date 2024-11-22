import { useDispatch, useSelector } from "react-redux";
import { toggleLocationModal } from "../../Redux/ModalSlice/ModalSlice";
import {
  addingLocation,
  addLocation,
} from "../../Redux/LocationSlice/LocationSlice";
import { useEffect, useState } from "react";
import { fetchingData } from "../../Data";
import Spinner from "../Spinner/Spinner";

const LocationModal = () => {
  const dispatch = useDispatch();
  const { isLocationModalActive } = useSelector((state) => state.modals);
  const [loading, setLoading] = useState(false);
  const [locationList, setLocationList] = useState([]);

  const handleChangeLocation = (value) => {
    if (value) {
      dispatch(addingLocation());
      dispatch(addLocation(value));
      dispatch(toggleLocationModal());
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await fetchingData("/getLocationData");
        if (result.status == 200) {
          // console.log(result?.data);
          setLoading(false);
          return setLocationList(result?.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  return (
    <>
      <div
        className={`fixed ${
          !isLocationModalActive && "hidden"
        } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
      >
        <div className="relative top-20 mx-auto shadow-xl rounded bg-white max-w-2xl">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="font-bold text-2xl uppercase">
              Choose <span className="text-theme">Location</span>
            </h2>
            <button
              onClick={() => dispatch(toggleLocationModal())}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 :gap-2 w-full overflow-hidden h-96 overflow-y-auto no-scrollbar">
              {!loading ? (
                locationList?.length > 0 &&
                locationList.map((item) => (
                  <button
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
                      className="w-full h-[80%] object-cover rounded-lg"
                      alt="SEARCH_LOCATION"
                    />
                    <h2 className="text-gray-600 font-semibold mt-2">
                      {item?.locationName}
                    </h2>
                  </button>
                ))
              ) : (
                <div className="text-center col-span-full">
                  <Spinner message={"loading.."} />
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
