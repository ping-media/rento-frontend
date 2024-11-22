const Spinner = ({ message }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-4 border-t-theme border-gray-300 rounded-full animate-spin"></div>
      <span className="mr-2">{message}</span>
    </div>
  );
};

export default Spinner;
