import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addDaysToDateForExtend,
  addOneMinute,
  calculatePriceForExtendBooking,
  formatFullDateAndTime,
  formatPrice,
} from "../../utils/index";
import { handleAsyncError } from "../../utils/handleAsyncError";
import Spinner from "../Spinner/Spinner";
import { fetchingData, handlePostData } from "../../Data";
import { toggleBookingExtendModal } from "../../Redux/ModalSlice/ModalSlice";
import { createOrderId } from "../../Data/Payment";
import { openRazorpayPayment } from "../../utils/razorpay";
import { useNavigate } from "react-router-dom";
import { updateRidesData } from "../../Redux/RidesSlice/RideSlice";

const ExtendBookingModal = () => {
  const { isBookingExtendModalActive } = useSelector((state) => state.modals);
  const { rides, loading } = useSelector((state) => state.rides);
  const [extensionDays, setExtensionDays] = useState(0);
  const [extendPrice, setExtendPrice] = useState(0);
  const [newDate, setNewDate] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [plan, setPlan] = useState({ data: null, loading: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // extend bookng function
  const handleExtendBooking = async (event) => {
    event.preventDefault();
    if (!newDate) return;

    const finalAmount = calculatePriceForExtendBooking(
      rides[0]?.bookingPrice?.rentAmount,
      extensionDays,
      Number(rides[0]?.bookingPrice?.extraAddonPrice)
    );

    let data = {
      _id: rides[0]?._id,
      vehicleTableId: rides[0]?.vehicleTableId,
      BookingStartDateAndTime: addOneMinute(
        rides[0]?.BookingEndDateAndTime
      ).replace(".000Z", "Z"),
      BookingEndDateAndTime: newDate,
      bookingPrice: rides[0]?.bookingPrice,
      extendBooking: rides[0]?.extendBooking,
      oldBookings: {
        BookingStartDateAndTime: rides[0]?.BookingStartDateAndTime,
        BookingEndDateAndTime: rides[0]?.BookingEndDateAndTime,
      },
      extendAmount: {
        id: rides[0]?.bookingPrice?.extendAmount?.length + 1,
        title: "extended",
        amount: finalAmount,
        paymentMethod: "",
        status: "unpaid",
      },
      bookingStatus: "extended",
    };
    if (!data) return;

    const isVehicleFree = await fetchingData(
      `/getAllVehiclesAvailable?_id=${data?.vehicleTableId}&BookingStartDateAndTime=${data?.BookingStartDateAndTime}&BookingEndDateAndTime=${data?.BookingEndDateAndTime}`
    );
    if (isVehicleFree?.status === 200) {
      if (isVehicleFree?.data?.length === 0) {
        handleAsyncError(dispatch, isVehicleFree?.message);
        return;
      }
    }

    try {
      setFormLoading(true);

      const orderId = await createOrderId(data, Number(finalAmount));
      if (orderId?.status === "created") {
        const response = await openRazorpayPayment({
          finalAmount,
          orderId: orderId?.id,
          bookingData: rides[0],
          dispatch,
          navigate,
        });

        if (response?.success === false) {
          return;
        }

        data = {
          ...data,
          extendAmount: {
            ...data?.extendAmount,
            paymentMethod: "online",
            status: "paid",
          },
          extendBooking: {
            oldBooking: rides[0]?.extendBooking?.oldBooking,
            transactionIds: [
              ...(rides[0]?.extendBooking?.transactionIds || []),
              orderId?.id,
              response?.response?.razorpay_payment_id,
            ],
          },
        };
      }

      const response = await handlePostData(
        `/extendBooking?BookingStartDateAndTime=${addOneMinute(
          rides[0]?.BookingEndDateAndTime
        )}&BookingEndDateAndTime=${newDate}&stationId=${rides[0]?.stationId}`,
        {
          ...data,
          contact: rides[0]?.userId?.contact,
          firstName: rides[0]?.userId?.firstName,
          managerContact: rides[0]?.stationMasterUserId?.contact,
        }
      );
      if (response?.status === 200) {
        const { contact, firstName, managerContact, ...restData } = data;
        dispatch(updateRidesData(restData));
        // updating the timeline for booking
        const timeLineData = {
          currentBooking_id: data?._id,
          timeLine: [
            {
              title: "Payment Received",
              date: new Date().toLocaleString(),
              paymentAmount: finalAmount,
              id: data?.extendAmount?.id,
            },
          ],
        };
        await handlePostData("/createTimeline", timeLineData);
        handleAsyncError(dispatch, "Booking extend successfully");
        handleCloseModal();
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setPlan((prev) => ({ ...prev, loading: true }));
        const response = await fetchingData("/getPlanData?page=1&limit=50");
        if (response.status === 200) {
          setPlan((prev) => ({ ...prev, data: response?.data }));
        }
      } finally {
        setPlan((prev) => ({ ...prev, loading: false }));
      }
    })();
  }, []);

  // after closing the modal clear all the state to default
  const handleCloseModal = () => {
    setExtensionDays(0);
    setNewDate("");
    dispatch(toggleBookingExtendModal());
  };

  // for showing extend vehicle price on based on days
  useEffect(() => {
    if (Number(extensionDays) !== 0) {
      const hasPlan = plan?.data.filter(
        (plan) => Number(plan?.planDuration) === Number(extensionDays)
      );
      const planPrice = hasPlan?.length > 0 ? Number(hasPlan[0]?.planPrice) : 0;
      const price =
        planPrice > 0
          ? planPrice
          : calculatePriceForExtendBooking(
              rides[0]?.bookingPrice?.rentAmount,
              extensionDays
            );

      if (Number(price) > 0) {
        setExtendPrice(price);
      }
    } else {
      setExtendPrice(0);
    }
  }, [extensionDays]);

  //   change date and days
  const changeValue = (e) => {
    setExtensionDays(Number(e.target.value));
    const newDate = addDaysToDateForExtend(
      addOneMinute(rides[0]?.BookingEndDateAndTime),
      Number(e.target.value)
    );
    setNewDate(newDate);
  };

  if (loading || rides?.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed ${
        !isBookingExtendModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-lg">
        <div className="flex justify-between p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Extend Booking
          </h2>
          <button
            onClick={handleCloseModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={formLoading || false}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pt-0 text-center">
          <form onSubmit={handleExtendBooking}>
            <div className="mb-2">
              <p className="text-gray-400 text-left">
                <span className="font-semibold text-black mr-1">
                  Current End Date:
                </span>
                {formatFullDateAndTime(
                  addOneMinute(rides[0]?.BookingEndDateAndTime)
                )}
              </p>
            </div>
            <div className="mb-2">
              <label
                htmlFor="extension"
                className="block text-gray-800 font-bold text-sm capitalize text-left"
              >
                Extension Day's
              </label>

              <input
                type="number"
                id="extension"
                className="w-full px-5 py-3 block rounded-md ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none capitalize disabled:bg-gray-400 disabled:bg-opacity-20 mt-2"
                placeholder="Enter Extension Day's"
                value={extensionDays > 0 ? extensionDays : ""}
                onChange={(e) => changeValue(e)}
              />
            </div>
            <div>
              <div className="mb-2">
                <p
                  className={`text-gray-400 text-left ${
                    newDate === "" ? "italic" : ""
                  }`}
                >
                  <span className="font-semibold text-black not-italic mr-1">
                    New End Date:
                  </span>
                  {newDate !== ""
                    ? formatFullDateAndTime(newDate)
                    : "(Enter number of days to view the new date)"}
                </p>
              </div>
              <div className={`mb-2`}>
                <p className="text-theme text-left">
                  <span className="font-semibold text-black mr-1">
                    New Amount:
                  </span>
                  ₹{formatPrice(Number(extendPrice))}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Extend Booking"
              ) : (
                <Spinner message={"loading..."} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExtendBookingModal;
