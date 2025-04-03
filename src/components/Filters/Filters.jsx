import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "../../Redux/ModalSlice/ModalSlice";
import { fetchingPlansFilters } from "../../Data/Functions";
import { brands, Categories } from "../../Data/dummyData";
import CustomCheckbox from "../Input/CustomCheckbox";
import CheckboxFilter from "../Input/CheckBoxFilter";

const Filters = () => {
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  const { isFilterActive } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [queryParms, setQueryParms] = useSearchParams();

  // State for filters
  const [inputCategory, setInputCategory] = useState("");
  const [inputBrand, setInputBrand] = useState("");
  const [inputPlanId, setInputPlanId] = useState("");

  // Fetch filters from URL params
  useEffect(() => {
    const newQueryParamsData = Object.fromEntries(queryParms.entries());
    setInputCategory(newQueryParamsData.category?.toLowerCase() || "");
    setInputBrand(newQueryParamsData.brand?.toLowerCase() || "");
    setInputPlanId(newQueryParamsData.vehiclePlan || "");

    const commonId = id || selectedLocation?.locationId;
    if (commonId) fetchingPlansFilters(dispatch, commonId);
  }, [queryParms, id, selectedLocation, dispatch]);

  // Function to update filters
  const handleSubmitFilters = (
    selectedCategory,
    selectedPlanId,
    selectedBrand
  ) => {
    const updatedQueryParams = new URLSearchParams(queryParms);

    if (selectedCategory)
      updatedQueryParams.set("category", selectedCategory.toLowerCase());
    else updatedQueryParams.delete("category");

    if (selectedBrand) updatedQueryParams.set("brand", selectedBrand);
    else updatedQueryParams.delete("brand");

    if (selectedPlanId) updatedQueryParams.set("vehiclePlan", selectedPlanId);
    else updatedQueryParams.delete("vehiclePlan");

    setQueryParms(updatedQueryParams);

    if (isFilterActive) dispatch(toggleFilter());
  };

  return (
    <>
      <form>
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-3">Filters</h2>
          </div>

          <div className="flex items-center lg:justify-between gap-2">
            {Categories.map((item, index) => (
              <button
                key={index}
                type="button"
                data-category={item?.CategoryTitle.toLowerCase()}
                className={`w-20 lg:w-24 xl:w-28 border-2 rounded-lg hover:bg-theme group hover:border-theme transition duration-200 ease-in-out hover:shadow-md text-sm cursor-pointer ${
                  inputCategory === item?.CategoryTitle.toLowerCase()
                    ? "bg-theme text-gray-100 border-theme"
                    : ""
                }`}
                onClick={() => {
                  const newCategory =
                    inputCategory === item?.CategoryTitle.toLowerCase()
                      ? ""
                      : item?.CategoryTitle.toLowerCase();
                  setInputCategory(newCategory);
                  handleSubmitFilters(newCategory, inputPlanId, inputBrand);
                }}
              >
                <div className="w-10 h-10 mb-1 mx-auto">
                  <img
                    src={item.categoryImage}
                    className={`w-full h-full object-cover group-hover:invert transition duration-200 ease-in-out ${
                      inputCategory === item?.CategoryTitle.toLowerCase()
                        ? "invert"
                        : ""
                    }`}
                    alt={item?.CategoryTitle}
                  />
                </div>
                <h3 className="text-center group-hover:text-gray-100 transition duration-200 ease-in-out text-sm">
                  {item?.CategoryTitle}
                </h3>
              </button>
            ))}
          </div>
        </div>

        <h3 className="font-semibold mb-2">Choose Packages</h3>
        <div className="mb-5">
          <CheckboxFilter
            setPlanIdChanger={(planId) => {
              setInputPlanId(planId);
              handleSubmitFilters(inputCategory, planId, inputBrand);
            }}
          />
        </div>

        <h3 className="font-semibold mb-2">Choose Brand</h3>
        <div className="mb-5">
          <CustomCheckbox
            options={brands}
            onChange={(selectedBrand) => {
              setInputBrand(selectedBrand);
              handleSubmitFilters(inputCategory, inputPlanId, selectedBrand);
            }}
            notFoundMessage="No Brands Found."
          />
        </div>
      </form>
    </>
  );
};

export default Filters;
