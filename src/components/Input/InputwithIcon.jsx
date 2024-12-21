import { useEffect, useRef, useState } from "react";
// import { handleCheckValidation } from "../../utils";
import { useSelector } from "react-redux";

const InputWithIcon = ({ name, modalRef, autoComplete = "on", isEmpty }) => {
  const inputRef = useRef(null);
  const { tempContact } = useSelector((state) => state.user);
  const [inputValue, setInputValue] = useState(null);
  const [error, setError] = useState("");

  //wh
  useEffect(() => {
    if (modalRef && inputRef.current) {
      inputRef.current.focus();
    }
    // through help to make field blank if user close the modal and reopening it
    if (modalRef == false) {
      setInputValue(null);
    }
  }, [modalRef]);

  // setting the contact number if already present
  useEffect(() => {
    setInputValue(tempContact);
  }, [tempContact]);

  // changing the value
  const handleChangeValue = (e) => {
    setInputValue(e.target.value);
    isEmpty(e.target.value);
  };

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
          value={
            inputValue == null || inputValue == 0 ? "" : Number(inputValue)
          }
          onChange={(e) => handleChangeValue(e)}
          placeholder="Enter Phone Number"
          className={`w-full pl-[3.5rem] pr-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1 ${
            error != "" && "border-red-500"
          }`}
          // onBlur={() => handleCheckValidation(inputRef, setError)}
          autoComplete={autoComplete}
          required
        />
      </div>
    </>
  );
};

export default InputWithIcon;
