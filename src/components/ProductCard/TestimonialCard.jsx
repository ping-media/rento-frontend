import StarRating from "./StarRating";

const TestimonialCard = (item) => {
  return (
    <div className="bg-white shadow-md px-4 py-3 rounded-md h-full flex flex-col items-center min-h-[16rem]">
      <div className="w-10 h-10 mx-auto mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          className="size-12 stroke-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </div>
      <div className="flex items-center gap-1 justify-center mb-2">
        <StarRating count={item?.rating} />
      </div>

      <h3 className="text-lg font-semibold text-center">{item?.name}</h3>
      <p className="text-justify text-sm">{item?.message}</p>
    </div>
  );
};

export default TestimonialCard;
