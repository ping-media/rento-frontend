const Spinner = ({
  message = "Loading...",
  customColor = "text-gray-100 uppercase",
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-4 border-t-theme border-gray-300 rounded-full animate-spin"></div>
      <span className={`mx-2 ${customColor} font-semibold italic`}>
        {message}
      </span>
    </div>
  );
};

export default Spinner;
