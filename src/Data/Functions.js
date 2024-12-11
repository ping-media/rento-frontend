import { fetchingData } from ".";
import {
  addingFilters,
  hanldeAddFilters,
  resetFilters,
  restFilterLoading,
} from "../Redux/FiltersSlice/FiltersSlice";
import {
  addVehiclesData,
  fetchingVehicles,
} from "../Redux/ProductSlice/ProductsSlice";

// const handleSearchVehicleData = async (
//   dispatch,
//   queryParmsData,
//   location,
//   selectedLocation,
//   id
// ) => {
//   dispatch(fetchingVehicles());
//   let result;
//   if (location.pathname !== "/explore") {
//     const category = queryParmsData?.category;
//     const brand = queryParmsData?.brand;
//     // console.log(queryParmsData, location);
//     if (category != undefined && brand != undefined) {
//       result = await fetchingData(
//         `/getVehicleTblData?stationId=${id}&vehicleBrand=${brand}&vehicleType=${category}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
//       );
//     } else if (category != undefined) {
//       result = await fetchingData(
//         `/getVehicleTblData?stationId=${id}&vehicleType=${category}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
//       );
//     } else if (brand != undefined) {
//       result = await fetchingData(
//         `/getVehicleTblData?stationId=${id}&vehicleBrand=${brand}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
//       );
//     } else if (!category && !brand) {
//       result = await fetchingData(
//         `/getVehicleTblData?stationId=${id}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
//       );
//     }
//   } else {
//     const locationId = selectedLocation?.locationId;
//     result = await fetchingData(
//       `/getVehicleTblData?locationId=${locationId}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
//     );
//   }
//   if (result) {
//     // console.log(result);
//     dispatch(addVehiclesData(result?.data));
//   }
// };

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
      // Dispatch the result if available
      return dispatch(addVehiclesData(result?.data));
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching vehicle data:", error);
    // Optionally dispatch an error state if you want to show error messages
  }
};

const fetchingPlansFilters = async (dispatch, id) => {
  dispatch(addingFilters());
  try {
    let endpoint;
    // change the endpoint based on page whether it is explore or search
    // console.log(location.pathname.substring(0, 7));
    if (location.pathname.substring(0, 7) == "/search") {
      endpoint = `/getPlanData?stationId=${id}`;
    } else {
      endpoint = `/getPlanData?locationId=${id}`;
    }
    const response = await fetchingData(endpoint);
    if (response.status == 200) {
      // console.log(response?.data);
      return dispatch(hanldeAddFilters(response?.data));
    } else {
      return dispatch(hanldeAddFilters([]));
    }
  } catch (error) {
    dispatch(resetFilters());
    // console.log(error?.message);
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
        // console.log(result?.data);
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

export {
  handleSearchVehicleData,
  fetchingPlansFilters,
  searchData,
  getUserDocuments,
  changeAccordingToPlan,
};
