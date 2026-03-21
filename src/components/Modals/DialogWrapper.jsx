const DialogWrapper = ({
  open,
  onOpenChange,
  title,
  children,
  className = "top-20",
}) => {
  return (
    <div
      className={`fixed ${
        !open ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div
        className={`relative ${className} mx-auto shadow-xl rounded-md bg-white max-w-lg max-h-[80vh] flex flex-col`}
      >
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            {title}
          </h2>
          <button
            onClick={onOpenChange}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pt-2 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DialogWrapper;
