import DropDownButtonWithIcon from "../DropdownButton/DropDownButtonWithIcon";
import Button from "../Button/Button";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import React from "react";

const SearchForm = ({
  handleSearchRide,
  id,
  handletoggleSearchUpdate,
  pickupDate,
  setPickupDate,
  setDropoffDate,
  queryPickupTime,
  setQueryPickupTime,
  setQueryDropoffTime,
  dropoffDate,
  queryDropoffTime,
  isMonthly,
  isExplore,
  isSearchUpdatesActive,
}) => {
  return (
    <form
      className={`flex flex-wrap lg:grid ${
        isMonthly ? "grid-cols-3" : "grid-cols-4"
      } gap-3 lg:gap-4 ${isSearchUpdatesActive ? "mt-5" : "mt-1"} lg:mt-0`}
      onSubmit={handleSearchRide}
    >
      <div className="w-full">
        <label htmlFor="pickupLocation" className="text-gray-500 block mb-1">
          Pick-up Station
        </label>
        <DropDownButtonWithIcon
          labelId={"pickupLocationId"}
          isDisabled={isExplore ? true : false}
          value={id || ""}
        />
      </div>
      <div className="w-full">
        <label htmlFor="pickup-time" className="text-gray-500 block mb-1">
          Pick-up Date And Time
        </label>
        <DateTimePicker
          value={pickupDate}
          setValueChanger={setPickupDate}
          name={"pickup"}
          setDropoffChanger={setDropoffDate}
          timeValue={queryPickupTime}
          setTimeValueChanger={setQueryPickupTime}
          setDropTimeValueChanger={setQueryDropoffTime}
        />
      </div>
      {!isMonthly && (
        <>
          <div className="w-full">
            <label htmlFor="pickup-time" className="text-gray-500 block mb-1">
              Drop-off Date And Time
            </label>
            <DateTimePicker
              value={dropoffDate}
              setValueChanger={setDropoffDate}
              name={"dropoff"}
              timeValue={queryDropoffTime}
              setTimeValueChanger={setQueryDropoffTime}
            />
          </div>
        </>
      )}
      <Button
        buttonMessage={"Find"}
        handleStateChange={handletoggleSearchUpdate}
      />
    </form>
  );
};

export default React.memo(SearchForm);
