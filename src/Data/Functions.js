import { fetchingData, handlePostData } from ".";
import {
  addingFilters,
  hanldeAddFilters,
  resetFilters,
} from "../Redux/FiltersSlice/FiltersSlice";
import {
  addVehiclesData,
  fetchingVehicles,
} from "../Redux/ProductSlice/ProductsSlice";

const handleSearchVehicleData = async (
  dispatch,
  queryParmsData,
  location,
  selectedLocation,
  id
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
    const commonParams = `BookingStartDateAndTime=${BookingStartDateAndTime}&BookingEndDateAndTime=${BookingEndDateAndTime}`;

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
  // ride starting otp
  const startRideOtp = Math.floor(1000 + Math.random() * 9000);
  if (vehicles) {
    const data = {
      vehicleTableId: vehicles[0]?._id,
      userId: currentUser?._id,
      vehicleMasterId: vehicles[0]?.vehicleMasterId,
      BookingStartDateAndTime: queryParmsData?.BookingStartDateAndTime,
      BookingEndDateAndTime: queryParmsData?.BookingEndDateAndTime,
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
        timeLine: {
          "Booking Created": new Date().toLocaleString(),
        },
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
    if (!data)
      return handleAsyncError(
        dispatch,
        "something went wrong while booking Ride"
      );
    const response = await handlebooking(data);
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
        handleAsyncError(dispatch, "Ride booked successfully.", "success");
        return navigate(`/my-rides/summary/${response?.data?._id}`);
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
      data = {
        ...data,
        bookingPrice: {
          ...data.bookingPrice,
          userPaid: parseInt(
            data?.bookingPrice?.discountTotalPrice
              ? (data?.bookingPrice?.discountTotalPrice * 20) / 100
              : (data?.bookingPrice?.totalPrice * 20) / 100
          ),
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
            oldData = {
              ...oldData,
              bookingPrice: {
                ...oldData.bookingPrice,
                userPaid: parseInt(
                  oldData?.bookingPrice?.discountTotalPrice
                    ? (oldData?.bookingPrice?.discountTotalPrice * 20) / 100
                    : (oldData?.bookingPrice?.totalPrice * 20) / 100
                ),
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
            await handleUpdateBooking(
              updatedData,
              handlebooking,
              handleAsyncError,
              dispatch
            );

            // updating the timeline for payment
            const timeLineData = {
              currentBooking_id: updatedData?._id,
              timeLine: {
                "Payment Initiated": new Date().toLocaleString(),
              },
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
          `/my-rides/summary/${
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
};
