import bikeImg from "../../assets/logo/road.png";

const RideNotFound = () => {
  return (
    <>
      <div className="w-20 h-20 mx-auto">
        <img
          src={bikeImg}
          className="w-full h-full object-cover"
          style={{ filter: "opacity(0.4)" }}
          alt="NOT_FOUND"
        />
      </div>
      <p className="text-center font-semibold text-gray-400 italic">
        No Rides Found.
      </p>
    </>
  );
};

export default RideNotFound;
