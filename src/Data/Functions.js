import { fetchingData } from ".";
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
  dispatch(fetchingVehicles());
  let result;
  if (location.pathname !== "/explore") {
    const category = queryParmsData?.category;
    const brand = queryParmsData?.brand;
    // console.log(queryParmsData, location);
    if (category != undefined && brand != undefined) {
      result = await fetchingData(
        `/getVehicleTblData?stationId=${id}&vehicleBrand=${brand}&vehicleType=${category}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
      );
    } else if (category != undefined) {
      result = await fetchingData(
        `/getVehicleTblData?stationId=${id}&vehicleType=${category}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
      );
    } else if (brand != undefined) {
      result = await fetchingData(
        `/getVehicleTblData?stationId=${id}&vehicleBrand=${brand}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
      );
    } else if (!category && !brand) {
      result = await fetchingData(
        `/getVehicleTblData?stationId=${id}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
      );
    }
  } else {
    const locationId = selectedLocation?.locationId;
    result = await fetchingData(`/getVehicleTblData?locationId=${locationId}`);
  }
  if (result) {
    // console.log(result);
    dispatch(addVehiclesData(result?.data));
  }
};

const fetchingPlansFilters = async (dispatch, id) => {
  dispatch(addingFilters());
  try {
    let endpoint;
    // change the endpoint based on page whether it is explore or search
    if (location.pathname == "/search") {
      endpoint = `/getPlanData?stationId=${id}`;
    } else {
      endpoint = `/getPlanData?locationId=${id}`;
    }
    const response = await fetchingData(endpoint);
    if (response.status == 200) {
      // console.log(response?.data);
      dispatch(hanldeAddFilters(response?.data));
    }
  } catch (error) {
    dispatch(resetFilters());
    console.log(error?.message);
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

export { handleSearchVehicleData, fetchingPlansFilters, searchData };
