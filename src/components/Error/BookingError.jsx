import ErrorImg from "../../assets/logo/error.svg";

const BookingError = () => {
  return (
    <div className="w-[90%] mx-auto my-10">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <img src={ErrorImg} className="w-64 h-64 object-cover" alt="ERROR" />
        <p className="text-center text-2xl uppercase font-semibold my-5">
          Data not found.
        </p>
      </div>
    </div>
  );
};

export default BookingError;
