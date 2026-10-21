import React from "react";
import ProductSkeleton from "../../components/skeleton/ProductSkeleton";
import Card from "../../components/ProductCard/Card";

const VehicleGrid = ({ loading, vehicles, testMode }) => {
  const availableVehicles = vehicles?.availableVehicles || [];
  const excludedVehicles = vehicles?.excludedVehicles || [];

  if (loading) {
    return (
      <Section>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </Section>
    );
  }

  if (!loading && availableVehicles?.length === 0) {
    return (
      <p className="col-span-full py-10 text-center font-extrabold text-gray-500 tracking-wider text-2xl sm:text-xl">
        NO VEHICLE FOUND.
      </p>
    );
  }

  return (
    <Section>
      {availableVehicles?.map((item) => (
        <Card {...item} isSold={testMode} key={item._id} />
      ))}
      {excludedVehicles?.map((item) => (
        <Card {...item} isSold key={item._id} />
      ))}
    </Section>
  );
};

export default React.memo(VehicleGrid);

const Section = ({ children }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
};
