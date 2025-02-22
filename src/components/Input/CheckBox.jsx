import { forwardRef } from "react";

const Checkbox = forwardRef(({ Message, labelId, setValue }, ref) => {
  return (
    <div className="mb-3">
      <label
        htmlFor={labelId}
        className="flex flex-row items-center text-xs gap-2.5 text-gray-500"
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
        {Message}
      </label>
    </div>
  );
});

export default Checkbox;
