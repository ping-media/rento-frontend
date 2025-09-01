import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addVehiclesData,
  fetchingVehicles,
} from "../Redux/ProductSlice/ProductsSlice";
import { fetchingData } from "../Data";

export const useVehicleData = (id, queryParmsData) => {
  const { vehicles } = useSelector((state) => state.vehicles);
  const [vehiclePlanData, setVehiclePlanData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const allVehicles = vehicles?.availableVehicles;

    if (allVehicles?.length > 0) {
      const currentVehicle = allVehicles.filter(
        (vehicle) => vehicle?._id === id
      );
      if (currentVehicle) {
        dispatch(addVehiclesData(currentVehicle));
        if (queryParmsData?.vehiclePlan) {
          setVehiclePlanData(currentVehicle[0]?.vehiclePlan);
        }
      }
    } else {
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
    }
  }, [id, queryParmsData]);

  return { vehiclePlanData };
};
