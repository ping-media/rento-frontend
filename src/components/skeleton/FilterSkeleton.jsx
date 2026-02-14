import React from "react";

const FilterSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-5 animate-pulse">
      {/* Title */}
      <div className="h-6 w-24 bg-gray-300 rounded mb-6"></div>

      {/* Vehicle Type Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="h-24 bg-gray-300 rounded-xl"></div>
        <div className="h-24 bg-gray-300 rounded-xl"></div>
      </div>

      {/* Choose Packages Title */}
      <div className="h-5 w-40 bg-gray-300 rounded mb-4"></div>

      {/* Packages checkboxes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Choose Brand Title */}
      <div className="h-5 w-32 bg-gray-300 rounded mb-4"></div>

      {/* Brand checkboxes */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(FilterSkeleton);
