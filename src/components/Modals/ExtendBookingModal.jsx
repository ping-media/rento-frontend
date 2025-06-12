import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  addDaysToDateForExtend,
  addOneMinute,
  calculatePriceForExtendBooking,
  calculateTotalAddOnPrice,
  formatFullDateAndTime,
  formatPrice,
} from "../../utils/index";
import { handleAsyncError } from "../../utils/handleAsyncError";
import Spinner from "../Spinner/Spinner";
import { fetchingData, handlePostData } from "../../Data";
import { toggleBookingExtendModal } from "../../Redux/ModalSlice/ModalSlice";
import { openRazorpayPayment } from "../../utils/razorpay";
import { useNavigate } from "react-router-dom";
import { updateRidesData } from "../../Redux/RidesSlice/RideSlice";
import { debounce } from "lodash";
import { pollBookingStatus } from "../../Data/Functions";

const ExtendBookingModal = () => {
  const { isBookingExtendModalActive } = useSelector((state) => state.modals);
  const { general } = useSelector((state) => state.addon);
  const { rides, loading } = useSelector((state) => state.rides);
  const [extensionDays, setExtensionDays] = useState(0);
  const [freeVehicle, setFreeVehicle] = useState(null);
  const [extendPrice, setExtendPrice] = useState(0);
  const [daysBreakdown, setDaysBreakdown] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [addOnPrice, setAddOnPrice] = useState(0);
  const [newDate, setNewDate] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [plan, setPlan] = useState({ data: null, loading: false });
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkFreeVehicle = async () => {
    try {
      setPriceLoading(true);
      const isVehicleFree = await fetchingData(
        `/getAllVehiclesAvailable?_id=${
          rides?.[0]?.vehicleTableId?._id
        }&BookingStartDateAndTime=${addOneMinute(
          rides[0]?.BookingEndDateAndTime
        ).replace(".000Z", "Z")}&BookingEndDateAndTime=${newDate}`
      );
      if (isVehicleFree?.status === 200) {
        setFreeVehicle(
          isVehicleFree?.data?.length > 0 ? isVehicleFree?.data[0] : null
        );
        if (isVehicleFree?.data?.length === 0) {
          handleAsyncError(dispatch, isVehicleFree?.message);
          return;
        }
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to get Vehicle Info! try again");
    } finally {
      setPriceLoading(false);
    }
  };

  // extend bookng function
  const handleExtendBooking = async (event) => {
    event.preventDefault();
    if (!newDate) return;

    if (extendPrice === 0) {
      return handleAsyncError(dispatch, "Unable to get Price! try again");
    }

    const extendAmountList = rides[0]?.bookingPrice?.extendAmount || [];

    let data = {
      _id: rides[0]?._id,
      vehicleTableId: rides[0]?.vehicleTableId?._id,
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
        id: extendAmountList?.length + 1,
        title: "extended",
        extendDuration: extensionDays,
        amount: extendPrice,
        addOnAmount: addOnPrice,
        BookingStartDateAndTime: addOneMinute(
          rides[0]?.BookingEndDateAndTime
        ).replace(".000Z", "Z"),
        bookingEndDateAndTime: newDate,
        daysBreakdown: daysBreakdown || [],
        package: selectedPlan || [],
        orderId: "",
        transactionId: "",
        paymentMethod: "",
        status: "unpaid",
      },
      bookingStatus: "extended",
    };

    if (!data) return;

    try {
      setFormLoading(true);
      data = {
        ...data,
        contact: rides[0]?.userId?.contact,
        firstName: rides[0]?.userId?.firstName,
        managerContact: rides[0]?.stationMasterUserId?.contact,
      };
      const orderId = await handlePostData("/initiate-extend-booking ", {
        _id: rides[0]?._id,
        bookingId: rides[0]?.bookingId,
        amount: Number(extendPrice) + Number(addOnPrice),
        data,
      });
      if (orderId?.status === "created" && orderId?.bookingUpdate === true) {
        const paymentSuccess = await openRazorpayPayment({
          finalAmount: extendPrice + Number(addOnPrice),
          orderId: orderId?.id,
          bookingData: rides[0],
          dispatch,
          navigate,
        });

        if (paymentSuccess) {
          const confirmed = await pollBookingStatus(rides[0]?._id, "extend");

          if (confirmed) {
            data = {
              ...data,
              extendAmount: {
                ...data?.extendAmount,
                paymentMethod: "online",
                status: "paid",
              },
            };
          }
          const { contact, firstName, managerContact, ...restData } = data;
          dispatch(updateRidesData(restData));
          handleAsyncError(dispatch, "Ride extended successfully", "success");
          handleCloseModal();
          return;
        } else {
          return;
        }
      } else {
        handleAsyncError(dispatch, orderId?.message);
        return;
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (plan?.data === null && rides[0]?.vehicleTableId?.vehiclePlan?.length) {
      setPlan((prev) => ({
        ...prev,
        data: rides[0]?.vehicleTableId?.vehiclePlan,
      }));
    }
  }, [rides]);

  useEffect(() => {
    if (rides?.length === 0 || !newDate) return;

    const debouncedCheck = debounce(() => {
      checkFreeVehicle();
    }, 200);
    debouncedCheck();

    return () => {
      debouncedCheck.cancel();
    };
  }, [rides, newDate]);

  // after closing the modal clear all the state to default
  const handleCloseModal = () => {
    setExtensionDays(0);
    setNewDate("");
    dispatch(toggleBookingExtendModal());
  };

  useEffect(() => {
    if (isBookingExtendModalActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isBookingExtendModalActive]);

  // for showing extend vehicle price on based on days
  useEffect(() => {
    if (Number(extensionDays) !== 0 && freeVehicle !== null) {
      const hasPlan =
        plan?.data?.length > 0
          ? plan?.data?.filter(
              (plan) => Number(plan?.planDuration) === Number(extensionDays)
            )
          : [];
      const planPrice = hasPlan?.length > 0 ? Number(hasPlan[0]?.planPrice) : 0;
      const extraAddonPrice =
        rides[0]?.bookingPrice?.extraAddonDetails &&
        rides[0]?.bookingPrice?.extraAddonDetails?.length > 0
          ? calculateTotalAddOnPrice(
              rides[0]?.bookingPrice?.extraAddonDetails,
              extensionDays
            )
          : 0;
      const price =
        planPrice > 0
          ? planPrice + extraAddonPrice
          : calculatePriceForExtendBooking(
              freeVehicle?.totalRentalCost,
              extraAddonPrice,
              general?.status === "inactive" ? false : true || false,
              general?.percentage || 18
            );

      if (Number(price) > 0) {
        setExtendPrice(price);
        setAddOnPrice(extraAddonPrice);
        setDaysBreakdown(freeVehicle?._daysBreakdown);
        setSelectedPlan(hasPlan);
      }
    } else {
      setExtendPrice(0);
    }
  }, [extensionDays, freeVehicle]);

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
        <div className="flex justify-between border-b p-2">
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

        <div className="p-6 pt-2 text-center">
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
                ref={inputRef}
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
                <div className="flex items-center text-theme text-left">
                  <p className="font-semibold text-black mr-1">New Amount:</p>
                  {priceLoading ? (
                    <p className="w-20 h-5 bg-gray-300/80 rounded-md animate-pulse"></p>
                  ) : (
                    `₹${formatPrice(Number(extendPrice))}`
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-theme/60 w-full flex items-center justify-center"
              disabled={extendPrice === 0 ? true : false || formLoading}
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
