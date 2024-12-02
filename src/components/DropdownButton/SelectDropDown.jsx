import { useState } from "react";

const SelectDropDown = ({ name, labelDesc, labelId, value }) => {
  return (
    <>
      <div className="relative text-gray-500 w-full">
        <label htmlFor={labelId} className="font-semibold mb-2">
          {labelDesc}
        </label>
        <select
          name={name}
          id={labelId}
          value={value}
          className="w-full px-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1"
        >
          <option>Choose Gender</option>
          <option value={"male"} className="capitalize">
            male
          </option>
          <option value={"female"} className="capitalize">
            female
          </option>
        </select>
        {/* <input
          type={type}
          name={name}
          id={labelId}
          placeholder={placeholderDesc}
          className="w-full px-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        /> */}
      </div>
    </>
  );
};

export default SelectDropDown;
