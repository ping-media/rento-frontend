import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PreLoader from "../skeleton/PreLoader";
import { useSearchParams } from "react-router-dom";

const CheckboxFilter = ({ setPlanIdChanger }) => {
  const { filter, filterLoading } = useSelector((state) => state.filter);
  const [query] = useSearchParams();
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const handleCheckboxChange = (planId) => {
    const newPlanId = selectedPlanId === planId ? null : planId;

    setSelectedPlanId(newPlanId);
    setPlanIdChanger(newPlanId);
  };

  // Sync state with URL parameters on load
  useEffect(() => {
    const vehiclePlanId = query.get("vehiclePlan") || null;
    setSelectedPlanId(vehiclePlanId);
  }, [query]);

  return !filterLoading ? (
    filter.length > 0 ? (
      <div className="grid grid-cols-2 gap-3">
        {filter?.map((item, index) => (
          <div key={item?._id || index}>
            <label
              htmlFor={item?.planName || item}
              className="flex flex-row items-center gap-2.5 text-gray-800 text-sm"
            >
              <input
                id={item?.planName || item}
                type="checkbox"
                className="peer hidden"
                value={item?._id}
                checked={selectedPlanId === item?._id}
                onChange={() => handleCheckboxChange(item?._id)}
              />
              <div className="h-6 w-6 flex rounded-md border-2 border-gray-300 bg-lighter-gray peer-checked:bg-theme peer-checked:border-theme transition">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 stroke-gray-100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12.6111L8.92308 17.5L20 6.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              {item?.planName || item}
            </label>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-400 italic">No Plans found.</div>
    )
  ) : (
    <PreLoader />
  );
};

export default CheckboxFilter;
