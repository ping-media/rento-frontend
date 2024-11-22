import { useEffect, useRef, useState } from "react";
import { handleCheckValidation } from "../../utils";

const InputWithIcon = ({ name, modalRef }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (modalRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalRef]);

  return (
    <>
      <div className="relative mt-2 text-gray-500 mb-2">
        <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
          +91
        </div>
        <input
          type="number"
          name={name}
          ref={inputRef}
          placeholder="Enter Phone Number"
          className={`w-full pl-[3.5rem] pr-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1 ${
            error != "" && "border-red-500"
          }`}
          onBlur={() => handleCheckValidation(inputRef, setError)}
          required
        />
      </div>
      <div
        className={`text-red-500 text-left capitalize ${
          error != "" ? "" : "hidden"
        }`}
      >
        <p>{error != "" && error}</p>
      </div>
    </>
  );
};

export default InputWithIcon;
