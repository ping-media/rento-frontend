const TopBanner = () => {
  return (
    <div className="w-full bg-theme text-black px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/placeholder-logo.png" alt="logo" className="w-6 h-6" />
        <span className="text-sm font-medium">
          Rent bikes & cars faster with our app
        </span>
      </div>

      <button className="bg-black text-white px-3 py-1 rounded-md text-sm">
        Open App
      </button>
    </div>
  );
};

export default TopBanner;
