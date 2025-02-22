const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-lg cursor-pointer shadow-md hover:shadow-xl relative animate-pulse">
      <div className="top-4 right-0 absolute">
        <div className="h-4 w-12 bg-gray-400 rounded"></div>
      </div>
      <div className="px-3 py-2">
        <div className="w-full h-48 bg-gray-400 bg-opacity-50 rounded-lg mb-3"></div>
        <div className="mb-2.5">
          <div className="h-4 w-full bg-gray-400 rounded"></div>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-8 h-8 bg-gray-400 bg-opacity-50 rounded-md mr-1"></div>
          <div className="h-4 w-32 bg-gray-400 rounded"></div>
        </div>
        <div className="h-4 w-32 bg-gray-400 rounded mb-5"></div>
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-20 bg-gray-400 rounded"></div>
          <button className="px-3 py-2 w-20 h-10 bg-gray-400 bg-opacity-50 transition duration-200 ease-in-out text-gray-100 rounded-lg"></button>
        </div>
        <div className="h-4 w-full bg-gray-400 rounded"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
