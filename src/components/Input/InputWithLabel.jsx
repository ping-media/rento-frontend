import { useEffect, useState } from "react";
import { isUser18 } from "../../utils";

const InputWithLabel = ({
  name,
  placeholderDesc,
  labelDesc,
  labelId,
  type = "text",
  value,
  required = false,
  setDOBChanger,
}) => {
  const [inputValue, setInputValue] = useState(value && value);
  const [isValidDOB, setIsValidDOB] = useState(false);

  const handleChangeValue = (value) => {
    setInputValue(value);
    if (name === "dateofbirth") {
      const isValid = isUser18(value);
      setIsValidDOB(isValid);
      setDOBChanger && setDOBChanger(isValid);
    }
  };

  useEffect(() => {
    if (value) {
      handleChangeValue(value);
    }
  }, []);

  return (
    <>
      <div className="relative text-gray-500 w-full">
        <label htmlFor={labelId} className="font-semibold mb-2">
          {labelDesc}
          {required && <span className="mx-1 text-red-500">*</span>}
          {!isValidDOB && name === "dateofbirth" && (
            <span className="text-theme text-sm">(Enter valid DOB)</span>
          )}
        </label>
        <input
          type={type}
          name={name}
          id={labelId}
          placeholder={placeholderDesc}
          className="w-full px-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1"
          value={inputValue}
          onChange={(e) => handleChangeValue(e.target.value)}
          required={required}
        />
      </div>
    </>
  );
};

export default InputWithLabel;
