const MyRidesPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      {/* ================= Left Profile Panel ================= */}
      <div className="lg:col-span-3 bg-white rounded-xl shadow p-5">
        {/* Avatar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-300 rounded" />
          </div>
        </div>

        <div className="h-px bg-gray-200 my-4" />

        {/* Menu items */}
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded-lg" />
          <div className="h-10 bg-gray-300 rounded-lg" />
        </div>
      </div>

      {/* ================= Right My Rides Panel ================= */}
      <div className="lg:col-span-9 bg-white rounded-xl shadow p-5">
        {/* Title */}
        <div className="h-6 w-40 bg-gray-300 rounded mb-6" />

        {/* Tabs */}
        <div className="flex gap-6 border-b pb-3 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
          ))}
        </div>

        {/* Empty / Content area */}
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
          <div className="h-4 w-32 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export default MyRidesPageSkeleton;
