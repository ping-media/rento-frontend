const RideCardSkeleton = () => {
  return (
    <div className="border rounded-xl p-4 mb-4 bg-white animate-pulse">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-32 h-24 bg-gray-200 rounded-md" />

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="h-5 w-1/2 bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>

        {/* Action */}
        <div className="h-8 w-24 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
};

export default RideCardSkeleton;
