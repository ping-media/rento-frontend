import { useEffect, useRef } from "react";

const Input = ({ name, modalRef, placeholderDesc, type = "number" }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (modalRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalRef]);

  return (
    <>
      <div className="relative text-gray-500 w-full">
        <input
          type={type}
          name={name}
          ref={inputRef}
          placeholder={placeholderDesc}
          className="w-full px-3 py-3.5 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1"
          // onChange={(e) => e.target.value}
          required
        />
      </div>
    </>
  );
};

export default Input;
