import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { toggleBookingTermModal } from "../../Redux/ModalSlice/ModalSlice";

const Checkbox = forwardRef(({ Message, labelId, setValue }, ref) => {
  const dispatch = useDispatch();
  return (
    <div>
      <label
        htmlFor={labelId}
        className="flex flex-row items-center text-xs lg:text-sm gap-2.5 text-gray-500"
      >
        <input
          id={labelId}
          type="checkbox"
          className="peer hidden"
          onChange={() => setValue(ref.current?.checked)}
          ref={ref}
        />
        <div
          htmlFor={labelId}
          className="h-6 w-6 flex rounded-md border-2 border-gray-300 bg-lighter-gray peer-checked:bg-theme peer-checked:border-theme transition"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5 stroke-gray-100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12.6111L8.92308 17.5L20 6.5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
        {Message ? (
          Message
        ) : (
          <p>
            By clicking, you agree to the
            <button
              type="button"
              className="ml-1 text-theme hover:underline hover:cursor-pointer"
              onClick={() => {
                dispatch(toggleBookingTermModal());
              }}
            >
              Terms & Conditions.
            </button>
          </p>
        )}
      </label>
    </div>
  );
});

export default Checkbox;
