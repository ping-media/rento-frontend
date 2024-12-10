import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleEmailVerifyModal } from "../../Redux/ModalSlice/ModalSlice";

const InputWithVerifyButton = ({
  name,
  placeholderDesc,
  labelDesc,
  labelId,
  type = "text",
  value,
  status,
  required = false,
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(value && value);
  // openning the email verfiy modal
  const handleEmailSubmit = () => {
    return dispatch(toggleEmailVerifyModal());
  };

  return (
    <>
      <div className="relative text-gray-500 w-full relative">
        <label htmlFor={labelId} className="font-semibold mb-2">
          {labelDesc}
          {required && <span className="mx-1 text-red-500">*</span>}
        </label>
        <input
          type={type}
          name={name}
          id={labelId}
          placeholder={placeholderDesc}
          className="w-full px-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required={required}
        />

        <button
          className={`${
            status == "yes"
              ? "bg-green-400 border-green-400 text-white cursor-pointer capitalize"
              : ""
          } absolute top-8 right-2 border-2 px-2.5 py-1 rounded-md`}
          type="button"
          onClick={handleEmailSubmit}
          disabled={
            status == "yes" ? true : false || inputValue != "" ? false : true
          }
        >
          {status == "no" ? "verify" : "verified"}
        </button>
      </div>
    </>
  );
};

export default InputWithVerifyButton;
