const Overlay = ({ message }) => {
  return (
    <div className="absolute bg-white bg-opacity-60 z-40 h-full w-full flex items-center justify-center">
      <div className="flex items-center">
        <span className="text-sm bg-theme px-4 py-2 text-gray-100 bg-opacity-90 rounded-lg">
          {message}
        </span>
      </div>
    </div>
  );
};

export default Overlay;
