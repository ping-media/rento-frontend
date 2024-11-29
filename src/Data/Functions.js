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
    const category = queryParmsData?.category?.toLowerCase();
    const brand = queryParmsData?.brand?.toLowerCase();
    if (category != undefined && brand != undefined) {
      result = await fetchingData(
        `/getVehicleTblData?stationId=${id}&vehicleBrand=${brand}&vehicleType=${category}`
      );
    } else if (category != undefined) {
      result = await fetchingData(
        `/getVehicleTblData?stationId=${id}&vehicleType=${category}`
      );
    } else if (brand != undefined) {
      result = await fetchingData(
        `/getVehicleTblData?stationId=${id}&vehicleBrand=${brand}`
      );
    } else {
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
    dispatch(addVehiclesData(result.data));
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

export { handleSearchVehicleData, fetchingPlansFilters };
