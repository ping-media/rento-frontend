const DetailsCard = ({ extraKmCharge }) => {
  const details = [
    "No Questions Asked Refund",
    `Extra ₹${extraKmCharge}/km + GST after free limit`,
    "Zero Deposit",
    "1 complimentary Helmet",
  ];
  return (
    <div className="border-t-2 border-gray-300 bg-white px-4 py-1.5">
      <h3 className="font-semibold mb-2 uppercase">Rent Details</h3>
      <ul className="flex flex-wrap w-full gap-2 items-center">
        {details.map((item, index) => (
          <li className="flex items-center w-full lg:w-[49%] gap-2" key={index}>
            <div className="w-7 h-7 p-1 bg-green-500 rounded-full">
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
