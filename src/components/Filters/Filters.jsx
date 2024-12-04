import { useEffect, useState } from "react";
import bikeImage from "../../assets/logo/bike.png";
import scooterImage from "../../assets/logo/scooter.png";
import DropDownButton from "../DropdownButton/DropDownButton";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "../../Redux/ModalSlice/ModalSlice";
import CheckboxFilter from "../Input/CheckBoxFilter";
import { fetchingPlansFilters } from "../../Data/Functions";

const Filters = () => {
  const Categories = [
    { categoryImage: scooterImage, CategoryTitle: "Non-Gear" },
    { categoryImage: bikeImage, CategoryTitle: "Gear" },
  ];

  const [inputCategory, setInputCategory] = useState("");
  const [inputbrand, setInputbrand] = useState("");
  const [inputPlanId, setInputPlanId] = useState("");
  const { isFilterActive } = useSelector((state) => state.modals);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const brands = [
    "Vespa",
    "Honda",
    "Yamaha",
    "Suzuki",
    "KTM",
    "BMW",
    "TVS",
    "Bajaj",
    "Hero",
    "Ather",
    "Ola",
    "Mahindra",
    "Royal Enfield",
    "Harley-Davidson",
  ];
  // const navigate = useNavigate();
  const [queryParms, setQueryParms] = useSearchParams();
  const [queryParmsData] = useState(Object.fromEntries(queryParms.entries()));

  useEffect(() => {
    const category = queryParmsData?.category;
    const brand = queryParmsData?.brand;

    if (category != undefined || brand != undefined) {
      setInputCategory(category.toLowerCase());
      setInputbrand(brand);
    }
    // for fetching plan filters
    fetchingPlansFilters(dispatch, id);
  }, []);

  const handleFilters = (e) => {
    e.preventDefault();
    if (inputCategory != "" && inputbrand != "Choose Brand") {
      // console.log("entered");
      //add new parameter in existing URL
      queryParms.set("category", inputCategory.toLowerCase());
      queryParms.set("brand", inputbrand);
      setQueryParms(queryParms);
    } else if (inputbrand != "Choose Brand") {
      // if it is present if not than do nothing
      if (queryParms.get("category")) {
        queryParms.delete("category");
      }
      queryParms.set("brand", inputbrand);
      setQueryParms(queryParms);
    } else {
      // if it is present if not than do nothing
      if (queryParms.get("brand")) {
        queryParms.delete("brand");
      }
      queryParms.set("category", inputCategory.toLowerCase());
      setQueryParms(queryParms);
    }
    if (isFilterActive === true) {
      dispatch(toggleFilter());
    }
  };

  const handleClearFilters = () => {
    // Delete 'category' if it exists
    if (queryParms.get("category")) {
      queryParms.delete("category");
    }

    // Delete 'brand' if it exists
    if (queryParms.get("brand")) {
      queryParms.delete("brand");
    }

    return setQueryParms(queryParms);
  };

  return (
    <>
      <form onSubmit={handleFilters}>
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold mb-3">Categories</h2>
            {(queryParms.get("brand") || queryParms.get("category")) && (
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
                  className="size-6"
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
          <div className="flex items-center justify-between">
            {Categories.map((item, index) => (
              <button
                type="button"
                className={`w-28 border-2 rounded-lg hover:bg-theme group hover:border-theme transition duration-200 ease-in-out hover:shadow-md text-sm cursor-pointer ${
                  inputCategory == item?.CategoryTitle
                    ? "bg-theme text-gray-100 border-theme"
                    : ""
                }`}
                onClick={() => setInputCategory(item?.CategoryTitle)}
                key={index}
              >
                <div className="w-10 h-10 mb-1 mx-auto">
                  <img
                    src={item.categoryImage}
                    className={`w-full h-full object-cover group-hover:invert transition duration-200 ease-in-out ${
                      inputCategory == item?.CategoryTitle ? "invert" : ""
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
          <CheckboxFilter />
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
