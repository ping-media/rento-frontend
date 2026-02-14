import React from "react";
import ProductSkeleton from "../../components/skeleton/ProductSkeleton";
import Card from "../../components/ProductCard/Card";

const VehicleGrid = ({ loading, vehicles, testMode }) => {
  if (!vehicles) return null;

  const availableVehicles = vehicles.availableVehicles || [];
  const excludedVehicles = vehicles.excludedVehicles || [];

  if (loading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </>
    );
  }

  if (loading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      <>
        {availableVehicles.map((item) => (
          <Card {...item} isSold={testMode} key={item._id} />
        ))}
        {excludedVehicles.map((item) => (
          <Card {...item} isSold key={item._id} />
        ))}
      </>
    </>
  );
};

export default React.memo(VehicleGrid);
