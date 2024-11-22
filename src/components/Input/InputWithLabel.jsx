import { useState } from "react";

const InputWithLabel = ({
  name,
  placeholderDesc,
  labelDesc,
  labelId,
  type = "text",
  value,
}) => {
  const [inputValue, setInputValue] = useState(value && value);
  return (
    <>
      <div className="relative text-gray-500 w-full">
        <label htmlFor={labelId} className="font-semibold mb-2">
          {labelDesc}
        </label>
        <input
          type={type}
          name={name}
          id={labelId}
          placeholder={placeholderDesc}
          className="w-full px-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default InputWithLabel;
