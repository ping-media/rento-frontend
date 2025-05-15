import { useNavigate } from "react-router-dom";
import ErrorImg from "../../assets/logo/error.svg";

const BookingError = ({ label = "Back to Search" }) => {
  const navigate = useNavigate();

  return (
    <div className="w-[90%] mx-auto my-10">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <img src={ErrorImg} className="w-64 h-64 object-cover" alt="ERROR" />
        <p className="text-center text-2xl uppercase font-semibold my-5 italic mb-3">
          Vehicle Data not found.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="w-40 bg-gray-300/50 rounded-md p-2 font-semibold italic hover:bg-gray-300 text-center"
        >
          {label}
        </button>
      </div>
    </div>
  );
};

export default BookingError;
