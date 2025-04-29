import React from "react";
import { formatDate, handlePreviousPage } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  toggleFilter,
  toggleSearchUpdate,
} from "../../Redux/ModalSlice/ModalSlice";

const MobileSearchRide = ({ pickup, dropoff }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="lg:hidden bg-white shadow-md px-3.5 py-2 lg:py-3 flex items-center justify-between">
      <button
        className="flex items-center gap-1 p-1"
        type="button"
        onClick={() => handlePreviousPage(navigate)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H6M12 5l-7 7 7 7" />
        </svg>
      </button>
      <button
        className="text-sm px-4 py-2 border-2 border-theme rounded-lg font-semibold"
        type="button"
        onClick={() => dispatch(toggleSearchUpdate())}
      >
        <span>
          {pickup != undefined && formatDate(new Date(pickup) || "--")}
        </span>
        <span className="mx-1 text-theme">To</span>
        <span>
          {dropoff != undefined && formatDate(new Date(dropoff) || "--")}
        </span>
      </button>
      <button type="button" onClick={() => dispatch(toggleFilter())}>
        <svg
          xmln="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default MobileSearchRide;
