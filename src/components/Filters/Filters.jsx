import { useEffect, useState } from "react";
import DropDownButton from "../DropdownButton/DropDownButton";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "../../Redux/ModalSlice/ModalSlice";
import CheckboxFilter from "../Input/CheckBoxFilter";
import { fetchingPlansFilters } from "../../Data/Functions";
import { brands, Categories } from "../../Data/dummyData";

const Filters = () => {
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  const [inputCategory, setInputCategory] = useState("");
  const [inputbrand, setInputbrand] = useState("");
  const [inputPlanId, setInputPlanId] = useState("");
  const { isFilterActive } = useSelector((state) => state.modals);
  const { id } = useParams();
  const dispatch = useDispatch();

  const [queryParms, setQueryParms] = useSearchParams();

  // for fetching plan filters & setting up the value if present in url
  useEffect(() => {
    const newQueryParmsData = Object.fromEntries(queryParms.entries());
    const { category, brand, vehiclePlan } = newQueryParmsData;

    if (category != undefined) {
      setInputCategory(category?.toLowerCase());
    }
    if (brand != undefined) {
      setInputbrand(brand?.toLowerCase());
    }
    if (vehiclePlan != undefined) {
      setInputPlanId(vehiclePlan);
    }
    // for fetching plan filters
    const commonId = id ? id : selectedLocation?.locationId;
    fetchingPlansFilters(dispatch, commonId);
  }, [location.pathname]);

  // this function will run after user apply any filter
  const handleSubmitFilters = (e) => {
    e.preventDefault();

    // Create a new URLSearchParams object to manipulate query params based on location.search
    const updatedQueryParams = new URLSearchParams(queryParms);

    // Set parameters if they are valid
    if (inputCategory !== "") {
      updatedQueryParams.set("category", inputCategory.toLowerCase());
    } else {
      updatedQueryParams.delete("category");
    }

    if (inputbrand !== "Choose Brand" && inputbrand !== "") {
      updatedQueryParams.set("brand", inputbrand.toLowerCase());
    } else {
      updatedQueryParams.delete("brand");
    }

    if (inputPlanId !== "") {
      updatedQueryParams.set("vehiclePlan", inputPlanId);
    } else {
      updatedQueryParams.delete("vehiclePlan");
    }

    // Update the query parameters using React Router's setQueryParms (does not modify the path)
    setQueryParms(updatedQueryParams);

    // Optionally close the filter modal if active
    if (isFilterActive === true) {
      dispatch(toggleFilter());
    }
  };

  // delete applied filters
  const handleClearFilters = () => {
    // Delete 'category' if it exists
    if (queryParms.get("category")) {
      queryParms.delete("category");
      setInputCategory("");
    }

    // Delete 'brand' if it exists
    if (queryParms.get("brand")) {
      queryParms.delete("brand");
      setInputbrand("");
    }

    // Delete 'vehiclePlan' if it exists
    if (queryParms.get("vehiclePlan")) {
      queryParms.delete("vehiclePlan");
      setInputPlanId("");
    }
    return setQueryParms(queryParms);
  };

  return (
    <>
      <form onSubmit={handleSubmitFilters}>
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold mb-3">Filters</h2>
            {(queryParms.get("brand") ||
              queryParms.get("category") ||
              queryParms.get("vehiclePlan")) && (
              <button
                className="px-1 py-1 border hover:border-theme hover:text-theme rounded"
                type="button"
                onClick={handleClearFilters}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center lg:justify-between gap-2">
            {Categories.map((item, index) => (
              <button
                type="button"
                className={`w-20 lg:w-24 xl:w-28 border-2 rounded-lg hover:bg-theme group hover:border-theme transition duration-200 ease-in-out hover:shadow-md text-sm cursor-pointer ${
                  inputCategory == item?.CategoryTitle.toLowerCase()
                    ? "bg-theme text-gray-100 border-theme"
                    : ""
                }`}
                onClick={() =>
                  setInputCategory(item?.CategoryTitle.toLowerCase())
                }
                key={index}
              >
                <div className="w-10 h-10 mb-1 mx-auto">
                  <img
                    src={item.categoryImage}
                    className={`w-full h-full object-cover group-hover:invert transition duration-200 ease-in-out ${
                      inputCategory == item?.CategoryTitle.toLowerCase()
                        ? "invert"
                        : ""
                    }`}
                    alt={item?.CategoryTitle.toLowerCase()}
                  />
                </div>
                <h3 className="text-center group-hover:text-gray-100 transition duration-200 ease-in-out text-sm">
                  {item?.CategoryTitle}
                </h3>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <DropDownButton
            labelId={"brands"}
            optionsList={brands}
            setValue={setInputbrand}
            defaultValue={inputbrand || "Choose Brand"}
          />
        </div>
        <h2 className="font-semibold mb-2">Choose Packages</h2>
        <div className="mb-5">
          <CheckboxFilter setPlanIdChanger={setInputPlanId} />
        </div>
        <button
          type="submit"
          className="w-full px-5 py-3 bg-theme text-gray-100 rounded-lg"
        >
          Apply
        </button>
      </form>
    </>
  );
};

export default Filters;
