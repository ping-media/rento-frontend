import { useState } from "react";

const InputWithIconAndLabel = ({
  name,
  labelId,
  placeholderDesc,
  labelDesc,
  value,
}) => {
  const [inputValue, setInputValue] = useState(value && value);
  return (
    <>
      <div className="text-gray-500">
        <label htmlFor={labelId} className="font-semibold mb-2">
          {labelDesc}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
            +91
          </div>
          <input
            type="number"
            name={name}
            id={labelId}
            placeholder={placeholderDesc}
            className="w-full pl-[3.5rem] pr-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
        </div>
      </div>
    </>
  );
};

export default InputWithIconAndLabel;
