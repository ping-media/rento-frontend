import Mainteance from "../assets/images/maintenance.png";

const Maintenance = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-80 lg:w-96 mx-auto">
        <img src={Mainteance} alt="MAINTENANCE" />
      </div>
      <div className="text-center mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🚧 Site Under Maintenance
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl">
          We’re currently performing some updates. We’ll be back shortly —
          thanks for your patience!
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
