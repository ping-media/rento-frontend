import { useEffect, useState } from "react";
import RideCard from "./RideCard";
import { fetchingData } from "../../Data";
import { useDispatch, useSelector } from "react-redux";
import { addRidesData, fetchingRides } from "../../Redux/RidesSlice/RideSlice";
import PreLoader from "../skeleton/PreLoader";
import RideNotFound from "../skeleton/RideNotFound";

const MyRides = () => {
  // State to track the selected tab
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { rides, loading } = useSelector((state) => state.rides);

  useEffect(() => {
    (async () => {
      dispatch(fetchingRides());
      const result = await fetchingData(
        `/getBookings?userId=${currentUser && currentUser?._id}`
      );
      // console.log(result);
      dispatch(addRidesData(result?.data));
    })();
  }, []);

  // Tab content array
  const tabs = [
    {
      name: "Pending",
      content: rides && rides.filter((item) => item?.rideStatus === "pending"),
    },
    {
      name: "Cancelled",
      content: rides && rides.filter((item) => item?.rideStatus === "canceled"),
    },
    {
      name: "All Bookings",
      content: rides && rides,
    },
  ];

  return (
    <div className="border-2 rounded-lg px-4 py-2 shadow-md bg-white mb-3">
      <div className="mb-1">
        <h2 className="font-bold text-xl uppercase py-2">
          My <span className="text-theme">Rides</span>
        </h2>
      </div>
      {/* Tab navigation */}
      <div className="flex space-x-4 border-b-2 pb-2 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 px-4 text-lg font-medium 
              ${
                activeTab === index
                  ? "text-theme border-b-2 border-theme"
                  : "text-gray-500"
              }
              hover:text-theme`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {!loading ? (
        <div className="mt-4">
          <div className="p-4 rounded-lg hover:overflow-y-auto overflow-hidden lg:max-h-96">
            <div>
              {tabs[activeTab].content.length > 0 ? (
                tabs[activeTab].content.map((item, index) => (
                  <RideCard item={item} key={index} />
                ))
              ) : (
                <RideNotFound />
              )}
            </div>
          </div>
        </div>
      ) : (
        <PreLoader />
      )}
    </div>
  );
};

export default MyRides;
