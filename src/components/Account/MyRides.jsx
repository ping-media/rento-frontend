import { lazy, Suspense, useEffect, useMemo, useState } from "react";
// import RideCard from "./RideCard";
import { fetchingData } from "../../Data";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { addRidesData, fetchingRides } from "../../Redux/RidesSlice/RideSlice";
import PreLoader from "../skeleton/PreLoader";
import RideNotFound from "../skeleton/RideNotFound";
import RideSkeletonList from "../skeleton/RideSkeletonList";

const RideCard = lazy(() => import("./RideCard"));

const TABS = ["Upcoming", "Ongoing", "Completed", "Cancelled", "All Bookings"];

const MyRides = () => {
  // State to track the selected tab
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { rides, loading } = useSelector(
    (s) => ({
      rides: s.rides.rides,
      loading: s.rides.loading,
    }),
    shallowEqual,
  );
  // const { rides, loading } = useSelector((state) => state.rides);

  useEffect(() => {
    if (!currentUser) return;

    (async () => {
      dispatch(fetchingRides());
      const result = await fetchingData(
        `/getBookings?userId=${currentUser?._id}`,
      );
      dispatch(addRidesData(result?.data));
    })();
  }, [currentUser, dispatch]);

  const filteredRides = useMemo(() => {
    if (!rides?.length) {
      return {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
      };
    }

    return {
      0: rides.filter(
        (r) =>
          (["pending", "paid", "partially_paid"].includes(r.paymentStatus) ||
            ["pending", "completed"].includes(r.bookingStatus)) &&
          !["ongoing", "completed"].includes(r.rideStatus),
      ),

      1: rides.filter(
        (r) => r.rideStatus === "ongoing" && r.paymentStatus !== "refunded",
      ),

      2: rides.filter(
        (r) => r.rideStatus === "completed" && r.paymentStatus !== "refunded",
      ),

      3: rides.filter(
        (r) =>
          ["canceled", "failed", "refunded"].includes(r.paymentStatus) ||
          ["canceled"].includes(r.bookingStatus) ||
          ["canceled"].includes(r.rideStatus),
      ),

      4: rides,
    };
  }, [rides]);

  const activeRides = filteredRides[activeTab];

  if (loading) {
    return <PreLoader />;
  }

  // Tab content array
  // const tabs = [
  //   {
  //     name: "Upcoming",
  //     content:
  //       rides &&
  //       rides.filter(
  //         (item) =>
  //           (item?.paymentStatus === "pending" ||
  //             item?.bookingStatus === "pending" ||
  //             item?.paymentStatus === "paid" ||
  //             item?.paymentStatus === "partially_paid" ||
  //             item?.bookingStatus === "completed") &&
  //           item?.rideStatus !== "ongoing" &&
  //           item?.rideStatus !== "completed"
  //       ),
  //   },
  //   {
  //     name: "Ongoing",
  //     content:
  //       rides &&
  //       rides.filter(
  //         (item) =>
  //           item?.rideStatus === "ongoing" && item?.paymentStatus !== "refunded"
  //       ),
  //   },
  //   {
  //     name: "Completed",
  //     content:
  //       rides &&
  //       rides.filter(
  //         (item) =>
  //           item?.rideStatus === "completed" &&
  //           item?.paymentStatus !== "refunded"
  //       ),
  //   },
  //   {
  //     name: "Cancelled",
  //     content:
  //       rides &&
  //       rides.filter(
  //         (item) =>
  //           item?.paymentStatus === "canceled" ||
  //           item?.paymentStatus === "failed" ||
  //           item?.bookingStatus === "canceled" ||
  //           item?.rideStatus === "canceled" ||
  //           item?.paymentStatus === "refunded"
  //       ),
  //   },
  //   {
  //     name: "All Bookings",
  //     content: rides && rides,
  //   },
  // ];

  return (
    <div className="border-2 rounded-lg px-2 lg:px-4 py-2 shadow-md bg-white mb-3">
      <div className="mb-1">
        <h2 className="font-bold text-xl uppercase py-2">
          My <span className="text-theme">Rides</span>
        </h2>
      </div>
      {/* Tab navigation */}
      <div className="flex space-x-4 border-b-2 pb-2 overflow-x-auto">
        {/* {tabs.map((tab, index) => ( */}
        {TABS.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`whitespace-nowrap py-2 px-2 lg:px-4 text-sm lg:text-base font-medium 
              ${
                activeTab === index
                  ? "text-theme border-b-2 border-theme"
                  : "text-gray-500"
              }
              hover:text-theme`}
          >
            {/* {tab.name} */}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        <div className="p-4 rounded-lg hover:overflow-y-auto overflow-hidden">
          <div>
            {loading ? (
              <RideSkeletonList />
            ) : activeRides.length ? (
              <Suspense fallback={<RideSkeletonList count={1} />}>
                {activeRides.map((ride) => (
                  <RideCard key={ride._id} item={ride} />
                ))}
              </Suspense>
            ) : (
              <RideNotFound />
            )}
            {/* {tabs[activeTab].content.length > 0 ? (
                tabs[activeTab].content.map((item, index) => {
                  return <RideCard item={item} key={index} />;
                })
              ) : (
                <RideNotFound />
              )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRides;
