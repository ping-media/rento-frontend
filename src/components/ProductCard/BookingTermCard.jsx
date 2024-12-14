import { termsAndConditions } from "../../Data/dummyData";

const BookingTermCard = () => {
  return (
    <div className="border-2 border-gray-300 rounded-lg bg-white shadow-md border-t-0 order-1 mb-2 lg:mb-0 w-full">
      <div className="px-8 py-2">
        <h3 className="font-semibold pb-2 border-b-2 mb-1 uppercase">
          Terms & Conditions
        </h3>
        <ul className="leading-6 text-gray-500 list-disc">
          {termsAndConditions.map((term, key) => (
            <li key={key}>{term}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingTermCard;
