import RideCardSkeleton from "./RideCardSkeleton";

const RideSkeletonList = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <RideCardSkeleton key={i} />
      ))}
    </>
  );
};

export default RideSkeletonList;
