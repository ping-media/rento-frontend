import { useState } from "react";

const TextAreaBox = ({
  name,
  labelId,
  placeholderDesc,
  labelDesc,
  value,
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(value && value);
  return (
    <>
      <div className="text-gray-500">
        <label htmlFor={labelId} className="font-semibold mb-2">
          {labelDesc}
          {required && <span className="mx-1 text-red-500">*</span>}
        </label>
        <div className="relative">
          <textarea
            name={name}
            id={labelId}
            placeholder={placeholderDesc}
            className="w-full px-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1 disabled:bg-gray-300 disabled:bg-opacity-30 resize-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required={required}
            disabled={name === "contact"}
            spellCheck="false"
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default TextAreaBox;
