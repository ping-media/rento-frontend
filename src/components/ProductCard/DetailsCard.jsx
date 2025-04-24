import { formatPrice } from "../../utils";

const DetailsCard = ({
  refundableDeposit,
  extraKmCharge,
  lateFee,
  speedLimit,
}) => {
  const details = [
    "No Questions Asked Refund",
    `Extra ₹${
      extraKmCharge ? formatPrice(Number(extraKmCharge)) : "--"
    }/KM + GST after free limit`,
    `₹${
      refundableDeposit ? formatPrice(Number(refundableDeposit)) : "--"
    } Deposit Amount`,
    "1 complimentary Helmet",
    `₹${lateFee ? formatPrice(Number(lateFee)) : "--"}/hr Late Amount`,
    `${speedLimit ? speedLimit : "--"}km/hr Speed Limit`,
  ];
  return (
    <div className="border-t-2 border-gray-300 bg-white mt-3 px-4 py-1.5">
      <h3 className="font-semibold mb-2 lg:mb-5 uppercase">Rent Details</h3>
      <ul className="flex flex-wrap leading-5 w-full gap-2 lg:gap-4 items-center">
        {details.map((item, index) => (
          <li className="flex items-center w-full lg:w-[49%] gap-2" key={index}>
            <div className="w-5 h-5 lg:w-7 lg:h-7 p-1 bg-green-500 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailsCard;
