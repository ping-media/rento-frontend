const PackageSkeleton = (cardCount = 4) => {
  return (
    <div className="w-full pt-8 pb-5 mt-5 animate-pulse">
      {/* Title */}
      <div className="h-8 w-64 mx-auto mb-6 bg-gray-200 rounded-md" />

      <div className="w-[95%] lg:w-[90%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: cardCount }).map((_, i) => (
            <div
              key={i}
              className="relative rounded-md overflow-hidden shadow-md bg-white px-4 py-3"
            >
              {/* Dotted background mimic */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,_#e5e7eb_1px,_transparent_1px)] bg-[length:10px_10px] opacity-40" />

              <div className="relative z-10 flex items-center gap-4">
                {/* Image placeholder */}
                <div className="w-20 h-20 rounded-md bg-gray-200" />

                {/* Text placeholders */}
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageSkeleton;
