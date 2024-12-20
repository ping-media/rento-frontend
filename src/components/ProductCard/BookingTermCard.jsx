import { useSelector } from "react-redux";

const BookingTermCard = () => {
  const { selectedLocation } = useSelector((state) => state.selectedLocation);

  // termsAndConditions
  const termsAndConditions = [
    "Documents Required: Aadhar Card and Driving License. Digilocker documents will work.",
    `All Scooters are to use within the ${selectedLocation?.locationName} City Limits.`,
    "Not allowed for commercial or delivery purpose.",
    "In case the vehicle returned is found excessively dirty/muddy, the lessee will have to bear the charge of washing not exceeding Rs. 200. You must report such violations to a Lessors Representative as soon as possible.",
    "Fuel Charges are not included in the security deposit or rent.",
    "In case of any damage to the vehicle, the customer is liable to pay the repair charges plus the labour charges as per the Authorised Service Center.",
  ];

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
