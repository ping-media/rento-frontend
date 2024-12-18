import { useEffect, useState } from "react";

const DropDownButton = ({ labelId, optionsList, setValue, defaultValue }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    defaultValue && optionsList.includes(defaultValue)
      ? defaultValue
      : "Choose Brand"
  );

  const handleChangeValue = (value) => {
    setSelectedValue(value);
    setIsOpened(!isOpened);
  };

  // Sync `selectedValue` with parent component if `setValue` is provided
  useEffect(() => {
    if (setValue && selectedValue !== "Choose Brand") {
      setValue(selectedValue); // Pass updated value to parent
    }
  }, [selectedValue, setValue]);

  useEffect(() => {
    // If defaultValue changes, update selectedValue to match it
    if (defaultValue && defaultValue !== selectedValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, selectedValue]);

  return (
    selectedValue && (
      <>
        <button
          className="border-2 px-5 py-3.5 focus:border-theme rounded-lg relative w-full capitalize text-sm"
          onClick={() => setIsOpened(!isOpened)}
          id={labelId}
          name={labelId}
          type="button"
        >
          <div className="flex items-center justify-between gap-2 font-semibold truncate">
            <span>{selectedValue}</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 ${isOpened && "rotate-180"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </button>
        {isOpened && (
          <div className="bg-white w-full transition duration-200 ease-in-out border-2 rounded-lg h-32 overflow-hidden mt-2 hover:overflow-y-auto">
            <ul className="py-1">
              {optionsList.map((location, index) => (
                <li
                  key={index}
                  onClick={() => handleChangeValue(location)}
                  className="w-full text-left py-1 hover:bg-gray-300 hover:bg-opacity-50 px-6 py-3 text-sm"
                >
                  {location}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    )
  );
};

export default DropDownButton;
