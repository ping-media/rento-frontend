import { useState } from "react";

const SelectDropDown = ({
  name,
  labelDesc,
  labelId,
  value,
  options,
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(value && value);

  const handleSelectChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div className="relative text-gray-500 w-full">
        <label htmlFor={labelId} className="font-semibold mb-2">
          {labelDesc}
          {required && <span className="mx-1 text-red-500">*</span>}
        </label>
        <select
          name={name}
          id={labelId}
          value={inputValue}
          onChange={handleSelectChange}
          className="w-full px-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1"
          required={required}
        >
          <option value={""}>Choose Gender</option>
          {options.map((option, index) => (
            <option value={option} className="capitalize" key={index}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SelectDropDown;
