import scooterImg from "../../assets/images/scooter-image.png";

const ErrorNotFound = ({ errorMessage }) => {
  return (
    <>
      <div className="flex items-center justify-center w-40 h-40 mx-auto mb-2">
        <img
          src={scooterImg}
          className="w-full h-full object-cover"
          alt="No_DATA_FOUND"
        />
      </div>
      <p className="text-center">{errorMessage}</p>
    </>
  );
};

export default ErrorNotFound;
