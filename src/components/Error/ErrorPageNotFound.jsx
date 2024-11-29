import notFoundImage from "../../assets/logo/404-Not-Found.svg";

const ErrorPageNotFound = () => {
  return (
    <div className="flex items-center min-h-screen relative">
      <div className="w-96 h-96 mx-auto">
        <img
          src={notFoundImage}
          className="w-full h-full object-cover"
          alt="PAGE_NOT_FOUND"
        />
      </div>
    </div>
  );
};

export default ErrorPageNotFound;
