import { useState } from "react";
import RideCard from "./RideCard";

const MyRides = () => {
  // State to track the selected tab
  const [activeTab, setActiveTab] = useState(0);

  const data = [
    {
      vehicleId: 1,
      vehicleName: "Honda Activa 5G STD",
      vehicleImage:
        "https://api.gobikes.co.in/uploads/bike/Honda-Activa-5g.png",
      bookingId: "#4567890",
      bookingDate: "12/11/24",
      bookingTime: "6:40 PM",
      station: "Agra",
      rentDuration: "1 hour",
      amountPaid: "587",
      rideStatus: "ongoing",
    },
    {
      vehicleId: 2,
      vehicleName: "Honda Activa 5G STD",
      vehicleImage:
        "https://api.gobikes.co.in/uploads/bike/Honda-Activa-5g.png",
      bookingId: "#4567890",
      bookingDate: "12/11/24",
      bookingTime: "3:40 PM",
      station: "Agra",
      rentDuration: "1 hour",
      amountPaid: "489",
      rideStatus: "cancelled",
    },
    {
      vehicleId: 3,
      vehicleName: "Honda Activa 5G STD",
      vehicleImage:
        "https://api.gobikes.co.in/uploads/bike/Honda-Activa-5g.png",
      bookingId: "#4567890",
      bookingDate: "12/11/24",
      bookingTime: "3:40 PM",
      station: "Agra",
      rentDuration: "1 hour",
      AmountToPay: "489",
      rideStatus: "upcoming",
    },
  ];

  // Tab content array
  const tabs = [
    {
      name: "OnGoing",
      content: data.filter((item) => item?.rideStatus === "ongoing"),
    },
    {
      name: "Cancelled",
      content: data.filter((item) => item?.rideStatus === "cancelled"),
    },
    {
      name: "Rejected",
      content: data.filter((item) => item?.rideStatus === "rejected"),
    },
    {
      name: "Extended",
      content: data.filter((item) => item?.rideStatus === "extended"),
    },
    {
      name: "Upcoming",
      content: data.filter((item) => item?.rideStatus === "upcoming"),
    },
    {
      name: "All Bookings",
      content: data,
    },
  ];

  return (
    <div className="border-2 rounded-lg px-4 py-2 shadow-md bg-white mb-3">
      <div className="mb-1">
        <h2 className="font-semibold text-xl uppercase py-2">
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
      <div className="mt-4">
        <div className="p-4 rounded-lg hover:overflow-y-auto overflow-hidden lg:max-h-96">
          <div>
            {tabs[activeTab].content.length > 0 ? (
              tabs[activeTab].content.map((item, index) => (
                <RideCard item={item} key={index} />
              ))
            ) : (
              <p className="text-center text-gray-400 italic">
                No Rides Found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRides;
