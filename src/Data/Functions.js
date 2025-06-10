import { fetchingData, handlePostData } from ".";
import {
  addingFilters,
  hanldeAddFilters,
  resetFilters,
} from "../Redux/FiltersSlice/FiltersSlice";
import {
  addPaginationData,
  addVehiclesData,
  fetchingVehicles,
} from "../Redux/ProductSlice/ProductsSlice";
import { openRazorpayPayment } from "../utils/razorpay";

const handleSearchVehicleData = async (
  dispatch,
  queryParmsData,
  location,
  selectedLocation,
  id,
  page
) => {
  // Dispatch loading action
  dispatch(fetchingVehicles());

  const {
    category,
    brand,
    BookingStartDateAndTime,
    BookingEndDateAndTime,
    vehiclePlan,
  } = queryParmsData;

  try {
    let result;
    let url = "/getVehicleTblData?";

    // Common parameters
    const commonParams = `BookingStartDateAndTime=${BookingStartDateAndTime}&BookingEndDateAndTime=${BookingEndDateAndTime}&page=${page}&bypassLimit=true`;

    if (location.pathname !== "/explore") {
      // For non-explore path
      url += `stationId=${id}&${commonParams}`;

      if (category) url += `&vehicleType=${category}`;
      if (brand) url += `&vehicleBrand=${brand}`;
      if (vehiclePlan) url += `&vehiclePlan=${vehiclePlan}`;
    } else {
      // For explore path
      const locationId = selectedLocation?.locationId;
      url += `locationId=${locationId}&${commonParams}`;
      if (category) url += `&vehicleType=${category}`;
      if (brand) url += `&vehicleBrand=${brand}`;
      if (vehiclePlan) url += `&vehiclePlan=${vehiclePlan}`;
    }

    // Fetch the data from API
    result = await fetchingData(url);

    if (result) {
      dispatch(addPaginationData(result?.pagination));
      return dispatch(addVehiclesData(result?.data));
    }
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
  }
};

const fetchingPlansFilters = async (dispatch, id) => {
  dispatch(addingFilters());
  try {
    let endpoint = "/getPlanData";
    const response = await fetchingData(endpoint);
    if (response.status == 200) {
      // console.log(response?.data);
      return dispatch(hanldeAddFilters(response?.data));
    } else {
      return dispatch(hanldeAddFilters([]));
    }
  } catch (error) {
    dispatch(resetFilters());
  }
};

const searchData = async (
  dispatch,
  selectedLocation,
  fetchingStation,
  addStationData,
  loading
) => {
  try {
    if (!loading && Object.entries(selectedLocation).length > 0) {
      dispatch(fetchingStation());
      const result = await fetchingData(
        `/getStationData?locationId=${selectedLocation?.locationId}`
      );
      if (result) {
        return dispatch(addStationData(result?.data));
      }
    }
  } catch (error) {
    return error.message;
  }
};

const getUserDocuments = async (
  handleLoadingUserData,
  currentUser,
  handleAddUserDocument,
  restLoading,
  dispatch,
  handleAsyncError
) => {
  dispatch(handleLoadingUserData());
  try {
    const response = await fetchingData(
      `/getDocument?userId=${currentUser && currentUser?._id}`
    );
    if (response?.status !== 200) {
      // console.log(response);
      return dispatch(restLoading());
    }
    return dispatch(handleAddUserDocument(response?.data));
  } catch (error) {
    return handleAsyncError(dispatch, error?.message);
  }
};

const changeAccordingToPlan = (
  vehiclePlanData,
  BookingEndDateAndTime,
  setUpdatedBookingEndDateAndTime,
  dispatch,
  addTempDate,
  tempDate,
  addDaysToDate,
  queryParms,
  setQueryParms
) => {
  if (vehiclePlanData != null) {
    const updatedBookingEndDateAndTime = addDaysToDate(
      BookingEndDateAndTime,
      Number(vehiclePlanData?.planDuration)
    );
    setUpdatedBookingEndDateAndTime(
      tempDate == "" ? updatedBookingEndDateAndTime : tempDate
    );
    if (updatedBookingEndDateAndTime) {
      if (tempDate == "") {
        dispatch(addTempDate(updatedBookingEndDateAndTime));
      }
      // const params = new URLSearchParams(window.location.search);
      queryParms.set(
        "BookingEndDateAndTime",
        tempDate == "" ? updatedBookingEndDateAndTime : tempDate
      );
      setQueryParms(queryParms);
    }
  }
};

const handleFetchBookingData = (
  e,
  vehicles,
  queryParmsData,
  currentUser,
  toggleLoginModal,
  addTempBookingData,
  setBookingLoading,
  vehiclePlanData,
  isDiscountZero,
  dispatch,
  id,
  updateQueryParams,
  tempCouponName,
  tempCouponId,
  navigate
) => {
  setBookingLoading(true);
  e.preventDefault();
  // if user is not login than don't let user to book the ride
  if (currentUser === null) {
    setBookingLoading(false);
    return dispatch(toggleLoginModal());
  }
  const response = new FormData(e.target);
  const result = Object.fromEntries(response.entries());
  // return console.log(result);
  // ride starting otp
  const startRideOtp = Math.floor(1000 + Math.random() * 9000);
  if (vehicles) {
    const data = {
      vehicleTableId: vehicles[0]?._id,
      userId: currentUser?._id,
      vehicleMasterId: vehicles[0]?.vehicleMasterId,
      BookingStartDateAndTime:
        (queryParmsData?.BookingStartDateAndTime).replace(".000Z", "Z"),
      BookingEndDateAndTime: (queryParmsData?.BookingEndDateAndTime).replace(
        ".000Z",
        "Z"
      ),
      bookingPrice: {
        bookingPrice: Number(result?.bookingPrice),
        vehiclePrice: Number(result?.bookingPrice),
        extraAddonPrice:
          result?.extraAddonPrice == "" ? 0 : Number(result?.extraAddonPrice),
        tax: Number(result?.tax),
        totalPrice: Number(result?.totalPrice),
        discountPrice: Number(result?.discountPrice || 0),
        discountTotalPrice: Number(result?.discounttotalPrice || 0),
        isDiscountZero: isDiscountZero,
        rentAmount: vehicles[0]?.perDayCost,
        isPackageApplied: vehiclePlanData != null,
        extendAmount: [],
      },
      vehicleBasic: {
        refundableDeposit: vehicles[0]?.refundableDeposit,
        speedLimit: vehicles[0]?.speedLimit,
        vehicleNumber: vehicles[0]?.vehicleNumber,
        freeLimit: vehicles[0]?.freeKms,
        lateFee: vehicles[0]?.lateFee,
        extraKmCharge: vehicles[0]?.extraKmsCharges,
        startRide: Number(startRideOtp),
        endRide: 0,
      },
      discountCuopon: {
        couponName: tempCouponName,
        couponId: tempCouponId,
      },
      extendBooking: {
        oldBooking: [],
        transactionIds: [],
      },
      vehicleName: vehicles[0]?.vehicleName,
      vehicleBrand: vehicles[0]?.vehicleBrand,
      vehicleImage: vehicles[0]?.vehicleImage,
      stationName: vehicles[0]?.stationName,
      bookingStatus: "pending",
      paymentStatus: "pending",
      rideStatus: "pending",
      paymentMethod: "NA",
      payInitFrom: "NA",
      paySuccessId: "NA",
    };
    dispatch(addTempBookingData(data));
    const url = updateQueryParams("/booking/payment/", id, queryParmsData);
    setBookingLoading(false);
    return navigate(url);
  }
};

const handleCreateBooking = async (
  data,
  handlebooking,
  removeTempDate,
  handleAsyncError,
  dispatch
) => {
  //removing this after we are going to booking
  dispatch(removeTempDate());
  try {
    if (!data) return handleAsyncError(dispatch, "Unable to Book Ride");
    const response = await handlebooking(data);
    if (response?.status == 200) {
      // updating the timeline for booking
      const timeLineData = {
        userId: response?.data?.userId,
        bookingId: response?.data?.bookingId,
        currentBooking_id: response?.data?._id,
        isStart: true,
        timeLine: [
          {
            title: "Booking Created",
            date: Date.now(),
          },
        ],
      };
      handlePostData("/createTimeline", timeLineData);
      return response;
    } else {
      handleAsyncError(dispatch, response?.message);
    }
  } catch (error) {
    console.log(error?.message);
  }
};

const handleUpdateBooking = async (
  data,
  handlebooking,
  handleAsyncError,
  dispatch
) => {
  try {
    if (!data && data._id)
      return handleAsyncError(
        dispatch,
        "something went wrong while booking Ride"
      );
    const response = await handlebooking(data, data?._id);
    if (response?.status == 200) {
      return response;
    } else {
      handleAsyncError(dispatch, response?.message);
    }
  } catch (error) {
    console.log(error?.message);
  }
};

// for creating booking
const handleCreateBookingSubmit = async (
  result,
  currentUser,
  tempBookingData,
  handleCreateBooking,
  handleUpdateBooking,
  createOrderId,
  razorPayment,
  handleRestCoupon,
  handleAsyncError,
  navigate,
  removeTempDate,
  handlebooking,
  dispatch,
  setBookingLoading
) => {
  try {
    setBookingLoading(true);
    let data;

    if (localStorage.getItem("tempBooking")) {
      data = JSON.parse(localStorage.getItem("tempBooking"));
    } else {
      data = tempBookingData;
    }
    // this is case if discount is zero
    if (data?.bookingPrice?.isDiscountZero === true) {
      // update the paymentMethod before sending the data for booking
      data = {
        ...data,
        paymentMethod: "online",
        bookingStatus: "done",
        paymentStatus: "paid",
      };
      // continue booking
      const response = await handleCreateBooking(
        data,
        handlebooking,
        removeTempDate,
        handleAsyncError,
        dispatch
      );
      if (response?.status === 200) {
        const timeLineData = {
          currentBooking_id: response?.data?._id,
          timeLine: [
            {
              title: "Booking Done",
              date: Date.now(),
            },
          ],
        };
        handlePostData("/createTimeline", timeLineData);
        handleAsyncError(dispatch, "Ride booked successfully.", "success");
        return navigate(`/account/my-rides/summary/${response?.data?._id}`);
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    }
    // continue
    if (!result?.paymentMethod) {
      setBookingLoading(false);
      return handleAsyncError(dispatch, "select payment method first!");
    } else if (result?.paymentMethod === "partiallyPay") {
      // if user select to pay some amount then this will run
      const userPaid = parseInt(
        data?.bookingPrice?.discountTotalPrice
          ? (data?.bookingPrice?.discountTotalPrice * 20) / 100
          : (data?.bookingPrice?.totalPrice * 20) / 100
      );
      // amount to be paid at pickup
      const AmountLeftAfterUserPaid =
        data?.bookingPrice?.discountTotalPrice &&
        data?.bookingPrice?.discountTotalPrice > 0
          ? Number(data?.bookingPrice?.discountTotalPrice) - Number(userPaid)
          : Number(data?.bookingPrice?.totalPrice) - Number(userPaid);

      data = {
        ...data,
        bookingPrice: {
          ...data.bookingPrice,
          userPaid: userPaid,
          AmountLeftAfterUserPaid: AmountLeftAfterUserPaid,
        },
      };
    }
    // pushing payment method
    data = { ...data, paymentMethod: result?.paymentMethod };

    if (
      result?.paymentMethod == "online" ||
      result?.paymentMethod == "partiallyPay"
    ) {
      let bookingResponse;
      // create booking if not present
      if (!localStorage.getItem("tempBooking")) {
        bookingResponse = await handleCreateBooking(
          data,
          handlebooking,
          removeTempDate,
          handleAsyncError,
          dispatch
        );
        // update booking if present
      } else if (
        JSON.parse(localStorage.getItem("tempBooking"))?.paymentMethod !=
        result?.paymentMethod
      ) {
        const bookedData = JSON.parse(localStorage.getItem("tempBooking"));
        const newData = {
          ...bookedData,
          paymentMethod: result?.paymentMethod,
        };
        // updating the booking
        bookingResponse = await handleUpdateBooking(
          newData,
          handlebooking,
          handleAsyncError,
          dispatch
        );
      }

      if (
        bookingResponse?.status == 200 ||
        localStorage.getItem("tempBooking")
      ) {
        let orderId;
        let updatedData;
        if (
          !localStorage.getItem("tempBooking") ||
          JSON.parse(localStorage.getItem("tempBooking"))?.paymentMethod !=
            result?.paymentMethod
        ) {
          let oldData =
            (Object.entries(bookingResponse?.data).length > 0 &&
              bookingResponse?.data) ||
            JSON.parse(localStorage.getItem("tempBooking"));
          if (
            result?.paymentMethod == "online" &&
            oldData?.bookingPrice?.userPaid
          ) {
            delete oldData?.bookingPrice?.userPaid;
          } else if (result?.paymentMethod == "partiallyPay") {
            const userPaid = parseInt(
              oldData?.bookingPrice?.discountTotalPrice
                ? (oldData?.bookingPrice?.discountTotalPrice * 20) / 100
                : (oldData?.bookingPrice?.totalPrice * 20) / 100
            );
            // amount to be paid at pickup
            const AmountLeftAfterUserPaid =
              oldData?.bookingPrice?.discountTotalPrice &&
              oldData?.bookingPrice?.discountTotalPrice > 0
                ? Number(oldData?.bookingPrice?.discountTotalPrice) -
                  Number(userPaid)
                : Number(oldData?.bookingPrice?.totalPrice) - Number(userPaid);
            oldData = {
              ...oldData,
              bookingPrice: {
                ...oldData.bookingPrice,
                userPaid: userPaid,
                AmountLeftAfterUserPaid: {
                  amount: AmountLeftAfterUserPaid,
                  status: "unpaid",
                  paymentMethod: "",
                },
              },
            };
          }

          orderId = await createOrderId(oldData);
          if (orderId?.status === "created") {
            updatedData = oldData;
            updatedData = {
              ...updatedData,
              payInitFrom: "Razorpay",
              paymentgatewayOrderId: orderId?.id,
              paymentgatewayReceiptId: orderId?.receipt,
              paymentInitiatedDate: orderId?.created_at,
            };

            // store booking data
            localStorage.setItem("tempBooking", JSON.stringify(oldData));

            // updating the booking with payment data
            const response = await handleUpdateBooking(
              updatedData,
              handlebooking,
              handleAsyncError,
              dispatch
            );

            if (response?.status === 200) {
              updatedData = response?.data;
            }

            // updating the timeline for payment
            const timeLineData = {
              currentBooking_id: updatedData?._id,
              timeLine: [
                {
                  title: "Payment Initiated",
                  date: Date.now(),
                },
              ],
            };
            handlePostData("/createTimeline", timeLineData);
          } else {
            handleAsyncError(dispatch, "unable to create orderId");
          }
        } else {
          updatedData = JSON.parse(localStorage.getItem("tempBooking"));
        }

        // if orderId is created successfully than send it to payment gateway
        return await razorPayment(
          currentUser,
          updatedData,
          orderId,
          result,
          handleUpdateBooking,
          handleAsyncError,
          navigate,
          handlebooking,
          dispatch,
          handleRestCoupon,
          setBookingLoading
        );
      }
    } else if (result?.paymentMethod == "cash") {
      let bookingResponse;
      let newData = JSON.parse(localStorage.getItem("tempBooking"));

      if (localStorage.getItem("tempBooking")) {
        // delete the userPaid if it is present
        newData?.bookingPrice?.userPaid &&
          delete newData?.bookingPrice?.userPaid;
        // update the data before sending to database
        newData = {
          ...newData,
          bookingStatus: "completed",
          paymentStatus: "pending",
          paymentMethod: result?.paymentMethod,
          payInitFrom: "cash",
          paySuccessId: "NA",
          paymentgatewayOrderId: "NA",
        };
        // update booking
        bookingResponse = await handleUpdateBooking(
          newData,
          handlebooking,
          handleAsyncError,
          dispatch
        );
      } else {
        data = {
          ...data,
          bookingStatus: "completed",
          paymentStatus: "pending",
          paymentMethod: result?.paymentMethod,
          payInitFrom: "cash",
          paySuccessId: "NA",
          paymentgatewayOrderId: "NA",
        };
        // create booking
        bookingResponse = await handleCreateBooking(
          data,
          handlebooking,
          removeTempDate,
          handleAsyncError,
          dispatch
        );
      }

      if (bookingResponse?.status === 200) {
        // deleting temp booking
        localStorage.removeItem("tempBooking");
        console.log(newData);
        handleAsyncError(dispatch, "Ride booked successfully.", "success");
        navigate(
          `/account/my-rides/summary/${
            bookingResponse?.data?.bookingId || newData?.bookingId
          }`
        );
      } else {
        handleAsyncError(dispatch, "unable to make booking! try again");
      }
    } else {
      handleAsyncError(dispatch, "please select payment option first");
    }
  } catch (error) {
    console.log(error?.message);
    return handleAsyncError(
      dispatch,
      "something went wrong while booking ride"
    );
  } finally {
    setBookingLoading(false);
  }
};

const handleBookingProcess = async (
  e,
  vehicles,
  queryParmsData,
  currentUser,
  toggleLoginModal,
  addTempBookingData,
  setBookingLoading,
  vehiclePlanData,
  isDiscountZero,
  dispatch,
  tempCouponName,
  tempCouponId,
  // tempBookingData,
  handleCreateBooking,
  handleUpdateBooking,
  createOrderId,
  razorPayment,
  handleRestCoupon,
  handleAsyncError,
  navigate,
  removeTempDate,
  handlebooking,
  selectedAddOn
) => {
  e.preventDefault();
  setBookingLoading(true);

  if (!currentUser) {
    setBookingLoading(false);
    return dispatch(toggleLoginModal());
  }

  if (!currentUser?._id) {
    return handleAsyncError(dispatch, "user not found! try again");
  }

  if (!queryParmsData)
    return handleAsyncError(dispatch, "unable to book ride now! try again");

  const formData = new FormData(e.target);
  const result = Object.fromEntries(formData.entries());

  if (!result?.paymentMethod) {
    setBookingLoading(false);
    return handleAsyncError(dispatch, "Select payment method first!");
  }

  const startRideOtp = Math.floor(1000 + Math.random() * 9000);

  if (!vehicles || vehicles.length === 0) return;
  // let data;
  // if (tempBookingData === null) {
  let data = {
    vehicleTableId: vehicles[0]?._id,
    userId: currentUser?._id,
    vehicleMasterId: vehicles[0]?.vehicleMasterId,
    BookingStartDateAndTime: queryParmsData?.BookingStartDateAndTime.replace(
      ".000Z",
      "Z"
    ),
    BookingEndDateAndTime: queryParmsData?.BookingEndDateAndTime.replace(
      ".000Z",
      "Z"
    ),
    bookingPrice: {
      bookingPrice: Number(result?.bookingPrice),
      vehiclePrice: Number(result?.bookingPrice),
      extraAddonDetails: selectedAddOn,
      extraAddonPrice: result?.extraAddonPrice
        ? Number(result?.extraAddonPrice)
        : 0,
      tax: isNaN(Number(result?.tax)) ? 0 : Number(result?.tax),
      totalPrice: Math.round(Number(result?.totalPrice)),
      discountPrice: Math.round(Number(result?.discountPrice || 0)),
      discountTotalPrice: isDiscountZero
        ? Math.round(
            Number(result?.discounttotalPrice || 0) +
              (Number(result?.extraAddonPrice) > 0
                ? Number(result?.extraAddonPrice)
                : 0)
          )
        : Number(result?.discounttotalPrice || 0) === 0
        ? 0
        : Number(result?.discounttotalPrice),
      isDiscountZero: isDiscountZero,
      rentAmount: vehicles[0]?.perDayCost,
      isPackageApplied: !!vehiclePlanData,
      daysBreakdown: vehicles[0]?._daysBreakdown || [],
      extendAmount: [],
    },
    vehicleBasic: {
      refundableDeposit: vehicles[0]?.refundableDeposit,
      speedLimit: vehicles[0]?.speedLimit,
      vehicleNumber: vehicles[0]?.vehicleNumber,
      freeLimit: vehicles[0]?.freeKms,
      lateFee: vehicles[0]?.lateFee,
      extraKmCharge: vehicles[0]?.extraKmsCharges,
      startRide: startRideOtp,
      endRide: 0,
    },
    discountCuopon: { couponName: tempCouponName, couponId: tempCouponId },
    extendBooking: { oldBooking: [], transactionIds: [] },
    vehicleName: vehicles[0]?.vehicleName,
    vehicleBrand: vehicles[0]?.vehicleBrand,
    vehicleImage: vehicles[0]?.vehicleImage,
    stationId: vehicles[0]?.stationId,
    stationName: vehicles[0]?.stationName,
    bookingStatus: "pending",
    paymentStatus: "pending",
    rideStatus: "pending",
    paymentMethod: "NA",
    payInitFrom: "NA",
    paySuccessId: "NA",
  };

  try {
    if (data?.bookingPrice?.isDiscountZero) {
      data = {
        ...data,
        paymentMethod: "online",
        bookingStatus: "done",
        paymentStatus: "paid",
      };
      const response = await handleCreateBooking(
        data,
        handlebooking,
        removeTempDate,
        handleAsyncError,
        dispatch
      );

      if (response?.status === 200) {
        handleAsyncError(dispatch, "Ride booked successfully.", "success");
        navigate(`/account/my-rides/summary/${response?.data?._id}`);
        return;
      }
    }

    if (result?.paymentMethod === "cash") {
      data = {
        ...data,
        payInitFrom: "Cash",
        bookingStatus: "done",
        paymentMethod: result?.paymentMethod,
      };

      const response = await handleCreateBooking(
        data,
        handlebooking,
        removeTempDate,
        handleAsyncError,
        dispatch
      );

      if (response?.status === 200) {
        const paymentAmount =
          data?.bookingPrice?.discountTotalPrice > 0
            ? data?.bookingPrice?.discountTotalPrice
            : data?.bookingPrice?.totalPrice;

        const timeLineData = {
          currentBooking_id: response?.data?._id,
          timeLine: [
            {
              title: "Pay Later",
              date: Date.now(),
              paymentAmount: paymentAmount || 0,
            },
          ],
        };
        await handlePostData("/createTimeline", timeLineData);
        handleAsyncError(dispatch, "Ride booked successfully.", "success");
        navigate(`/account/my-rides/summary/${response?.data?._id}`);
        return;
      }
    }

    if (result?.paymentMethod === "partiallyPay") {
      const userPaid = Math.round(
        (data?.bookingPrice?.discountTotalPrice ||
          data?.bookingPrice?.totalPrice) * 0.2
      );
      const AmountLeftAfterUserPaid =
        (data?.bookingPrice?.discountTotalPrice ||
          data?.bookingPrice?.totalPrice) - userPaid;
      data = {
        ...data,
        bookingPrice: {
          ...data.bookingPrice,
          userPaid,
          AmountLeftAfterUserPaid: {
            amount: Math.round(AmountLeftAfterUserPaid),
            status: "unpaid",
          },
        },
      };
    }

    data = { ...data, paymentMethod: result?.paymentMethod };

    if (["online", "partiallyPay"].includes(result?.paymentMethod)) {
      let bookingResponse = await handleCreateBooking(
        data,
        handlebooking,
        removeTempDate,
        handleAsyncError,
        dispatch
      );

      if (bookingResponse?.status === 200) {
        data = { ...data, ...bookingResponse.data };
        const orderId = await createOrderId(data);
        // console.log(bookingResponse.data, orderId);
        // return;
        if (orderId?.status === "created") {
          const response = await handleUpdateBooking(
            {
              ...data,
              payInitFrom: "Razorpay",
              paymentInitiatedDate: orderId?.created_at,
              paymentgatewayOrderId: orderId?.id,
              paymentgatewayReceiptId: orderId?.receipt,
            },
            handlebooking,
            handleAsyncError,
            dispatch
          );
          if (response?.status === 200) {
            data = response?.data;
            const timeLineData = {
              currentBooking_id: data?._id,
              timeLine: [
                {
                  title: "Payment Initiated",
                  date: Date.now(),
                },
              ],
            };
            await handlePostData("/createTimeline", timeLineData);
          } else {
            handleAsyncError(dispatch, "Unable to confirm payment!.");
            return;
          }
        }

        return await razorPayment(
          currentUser,
          data,
          orderId,
          result,
          handleAsyncError,
          navigate,
          dispatch,
          handleRestCoupon,
          setBookingLoading
        );
      }
    }
  } catch (error) {
    handleAsyncError(
      dispatch,
      "Something went wrong while booking ride",
      error?.message
    );
  } finally {
    setBookingLoading(false);
  }
};

const handleBooking = async (
  e,
  vehicles,
  queryParmsData,
  currentUser,
  toggleLoginModal,
  setBookingLoading,
  vehiclePlanData,
  isDiscountZero,
  dispatch,
  tempCouponName,
  tempCouponId,
  handleAsyncError,
  navigate,
  selectedAddOn
) => {
  e.preventDefault();
  setBookingLoading(true);

  if (!currentUser) {
    setBookingLoading(false);
    return dispatch(toggleLoginModal());
  }

  if (!currentUser?._id) {
    return handleAsyncError(dispatch, "user not found! try again");
  }

  if (!queryParmsData)
    return handleAsyncError(dispatch, "unable to book ride now! try again");

  const formData = new FormData(e.target);
  const result = Object.fromEntries(formData.entries());

  if (!result?.paymentMethod) {
    setBookingLoading(false);
    return handleAsyncError(dispatch, "Select payment method first!");
  }

  const startRideOtp = Math.floor(1000 + Math.random() * 9000);

  if (!vehicles || vehicles.length === 0) return;

  let data = {
    vehicleTableId: vehicles[0]?._id,
    userId: currentUser?._id,
    vehicleMasterId: vehicles[0]?.vehicleMasterId,
    BookingStartDateAndTime: queryParmsData?.BookingStartDateAndTime.replace(
      ".000Z",
      "Z"
    ),
    BookingEndDateAndTime: queryParmsData?.BookingEndDateAndTime.replace(
      ".000Z",
      "Z"
    ),
    bookingPrice: {
      bookingPrice: Number(result?.bookingPrice),
      vehiclePrice: Number(result?.bookingPrice),
      extraAddonDetails: selectedAddOn,
      extraAddonPrice: result?.extraAddonPrice
        ? Number(result?.extraAddonPrice)
        : 0,
      tax: isNaN(Number(result?.tax)) ? 0 : Number(result?.tax),
      totalPrice: Math.round(Number(result?.totalPrice)),
      discountPrice: Math.round(Number(result?.discountPrice || 0)),
      discountTotalPrice: isDiscountZero
        ? Math.round(
            Number(result?.discounttotalPrice || 0) +
              (Number(result?.extraAddonPrice) > 0
                ? Number(result?.extraAddonPrice)
                : 0)
          )
        : Number(result?.discounttotalPrice || 0) === 0
        ? 0
        : Number(result?.discounttotalPrice),
      isDiscountZero: isDiscountZero,
      rentAmount: vehicles[0]?.perDayCost,
      isPackageApplied: !!vehiclePlanData,
      daysBreakdown: vehicles[0]?._daysBreakdown || [],
      extendAmount: [],
    },
    vehicleBasic: {
      refundableDeposit: vehicles[0]?.refundableDeposit,
      speedLimit: vehicles[0]?.speedLimit,
      vehicleNumber: vehicles[0]?.vehicleNumber,
      freeLimit: vehicles[0]?.freeKms,
      lateFee: vehicles[0]?.lateFee,
      extraKmCharge: vehicles[0]?.extraKmsCharges,
      startRide: startRideOtp,
      endRide: 0,
    },
    discountCuopon: { couponName: tempCouponName, couponId: tempCouponId },
    extendBooking: { oldBooking: [], transactionIds: [] },
    vehicleName: vehicles[0]?.vehicleName,
    vehicleBrand: vehicles[0]?.vehicleBrand,
    vehicleImage: vehicles[0]?.vehicleImage,
    stationId: vehicles[0]?.stationId,
    stationName: vehicles[0]?.stationName,
    bookingStatus: "pending",
    paymentStatus: "pending",
    rideStatus: "pending",
    paymentMethod: "NA",
    payInitFrom: "NA",
    paySuccessId: "NA",
  };

  try {
    const response = await handlePostData("/initiate-booking", {
      bookingData: data,
      paymentMethod: result?.paymentMethod,
    });

    const { orderId, booking_id, payableAmount } = response.data;

    if (orderId && orderId !== "") {
      const paymentSuccess = await openRazorpayPayment(
        payableAmount,
        orderId,
        data,
        dispatch,
        navigate
      );

      if (paymentSuccess) {
        const confirmed = await pollBookingStatus(booking_id);

        if (confirmed) {
          setBookingLoading(false);
          navigate(`/account/my-rides/summary/${booking_id}`);
        } else {
          handleAsyncError(
            dispatch,
            "Payment confirmed, but booking status not updated. Please check later."
          );
          setBookingLoading(false);
        }
      }
    }
  } catch (error) {
    handleAsyncError(
      dispatch,
      "Something went wrong while booking ride",
      error?.message
    );
    setBookingLoading(false);
  }
};

const pollBookingStatus = async (
  bookingId,
  maxAttempts = 10,
  interval = 2000
) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const res = await fetchingData(`check-booking-status/${bookingId}`);
      const data = await res.json();

      if (data?.paymentStatus === "paid") {
        return true;
      }
    } catch (e) {
      console.error("Polling error:", e);
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
    attempts++;
  }

  return false;
};

export {
  handleSearchVehicleData,
  fetchingPlansFilters,
  searchData,
  getUserDocuments,
  changeAccordingToPlan,
  handleCreateBooking,
  handleFetchBookingData,
  handleUpdateBooking,
  handleCreateBookingSubmit,
  handleBookingProcess,
  handleBooking,
  pollBookingStatus,
};
