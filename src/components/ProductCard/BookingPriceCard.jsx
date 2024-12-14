import { formatPrice, getDurationInDays } from "../../utils";

const BookingPriceCard = ({
  bookingPrice,
  BookingStartDateAndTime,
  BookingEndDateAndTime,
}) => {
  const priceDetails = [
    {
      title: "Vehicle Rental Cost",
      name: "bookingPrice",
      price: bookingPrice?.bookingPrice,
    },
    {
      title: "Extra Helmet Price",
      name: "extraAddonPrice",
      price: bookingPrice?.extraAddonPrice,
    },
    {
      title: "GST(18% Applied)",
      name: "tax",
      price: bookingPrice?.tax,
    },
  ];
  return (
    <>
      <div className="mt-6 lg:mb-1">
        <ul className="leading-7 pb-3 border-b-2 border-gray-300">
          {priceDetails.map((item, index) => (
            <li className="flex items-center justify-between" key={index}>
              <div>
                <p className="text-gray-500 ">{item?.title}</p>
                {(item?.name == "bookingPrice" ||
                  item?.name == "extraAddonPrice") && (
                  <p className="text-xs text-gray-400">
                    (
                    {`₹${
                      item?.name == "extraAddonPrice"
                        ? 50
                        : bookingPrice?.rentAmount
                    } x ${getDurationInDays(
                      BookingStartDateAndTime,
                      BookingEndDateAndTime
                    )} day`}
                    )
                  </p>
                )}
              </div>
              <span className="font-semibold">₹{formatPrice(item?.price)}</span>
            </li>
          ))}
        </ul>
        {/* total price  */}
        <div className="flex items-center justify-between my-2.5">
          <span className="text-gray-500">Payable Amount</span>
          <span className="font-semibold">
            ₹{formatPrice(bookingPrice?.totalPrice)}
          </span>
        </div>
      </div>
    </>
  );
};

export default BookingPriceCard;
