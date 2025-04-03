import { useState, useEffect } from "react";

const CustomCheckbox = ({
  options,
  onChange,
  notFoundMessage,
  selectedValue,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brandQuery = params.get("brand");
    setSelectedItem(brandQuery || selectedValue || null);
  }, [selectedValue]);

  const handleCheckboxChange = (item) => {
    const newSelection = selectedItem === item ? null : item;
    setSelectedItem(newSelection);
    onChange(newSelection);
  };

  return options.length > 0 ? (
    <div className="grid grid-cols-2 gap-3">
      {options.map((item, index) => (
        <div key={index}>
          <label
            htmlFor={item}
            className="flex flex-row items-center gap-2.5 text-gray-800 text-sm capitalize"
          >
            <input
              id={item}
              type="checkbox"
              className="peer hidden"
              value={item}
              checked={selectedItem === item}
              onChange={() => handleCheckboxChange(item)}
            />
            <div className="h-6 w-6 flex rounded-md border-2 border-gray-300 bg-lighter-gray peer-checked:bg-theme peer-checked:border-theme transition">
              {selectedItem === item && (
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 stroke-gray-100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12.6111L8.92308 17.5L20 6.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              )}
            </div>
            {item}
          </label>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-gray-400 italic">
      {notFoundMessage || "No items found."}
    </div>
  );
};

export default CustomCheckbox;
