import React from "react";

const ChoosePackagesSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Title */}
      <div className="h-5 w-40 bg-gray-300 rounded mb-4"></div>

      {/* Checkbox Grid */}
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Checkbox */}
            <div className="w-6 h-6 bg-gray-300 rounded-md"></div>

            {/* Text */}
            <div className="h-4 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ChoosePackagesSkeleton);
