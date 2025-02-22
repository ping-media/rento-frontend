import { useState } from "react";

const InputWithIconAndLabel = ({
  name,
  labelId,
  placeholderDesc,
  labelDesc,
  value,
  required = false,
  inputError,
  setInputError,
  checkValue,
}) => {
  const [inputValue, setInputValue] = useState(value && value);
  // for vailding the input value
  const handleError = () => {
    if (setInputError && checkValue) {
      checkValue && checkValue === inputValue
        ? setInputError("alt contact & contact cannot be same")
        : setInputError("");
    }
    return;
  };
  return (
    <>
      <div className="text-gray-500">
        <label htmlFor={labelId} className="font-semibold mb-2">
          {labelDesc}
          {required && <span className="mx-1 text-red-500">*</span>}
          {inputError && inputError != "" && (
            <span className="text-theme">{inputError}</span>
          )}
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
            className="w-full pl-[3.5rem] pr-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1 disabled:bg-gray-300 disabled:bg-opacity-30"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required={required}
            disabled={name == "contact"}
            onBlur={handleError}
          />
        </div>
      </div>
    </>
  );
};

export default InputWithIconAndLabel;
