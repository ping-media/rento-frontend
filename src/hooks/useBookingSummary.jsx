import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addVehiclesData,
  fetchingVehicles,
} from "../Redux/ProductSlice/ProductsSlice";
import { fetchingData } from "../Data";

export const useVehicleData = (id, queryParmsData) => {
  const dispatch = useDispatch();
  const [vehiclePlanData, setVehiclePlanData] = useState(null);

  useEffect(() => {
    (async () => {
      dispatch(fetchingVehicles());
      const result = await fetchingData(
        `/getVehicleTblData?_id=${id}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
      );
      dispatch(addVehiclesData(result?.data?.availableVehicles));
      if (queryParmsData?.vehiclePlan) {
        setVehiclePlanData(result?.data?.availableVehicles[0]?.vehiclePlan);
      }
    })();
  }, [id, queryParmsData]);

  return { vehiclePlanData };
};
