import notFoundImage from "../../assets/logo/no-internet.png";

const NetworkError = () => {
  return (
    <div className="flex items-center min-h-screen relative">
      <div className="w-96 h-96 mx-auto">
        <img
          src={notFoundImage}
          className="w-full h-full object-cover"
          alt="NETWORK_ERROR"
        />
      </div>
    </div>
  );
};

export default NetworkError;
