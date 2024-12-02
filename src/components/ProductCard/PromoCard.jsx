const PromoCard = () => {
  return (
    <div className="border-2 border-gray-300 rounded-lg bg-white shadow-md border-t-0 order-1 mb-2 lg:mb-0 w-full">
      <div className="bg-theme rounded-t-lg mb-3">
        <h3 className="px-4 py-2 font-semibold text-gray-100">Promo Codes</h3>
      </div>
      <div className="relative text-gray-500 w-full py-2 px-4 mb-3">
        <input
          type="text"
          placeholder="Enter Promo Coupon Here"
          className="w-full px-3 py-2 appearance-none bg-transparent outline-none border focus:border-theme shadow-sm rounded-lg focus:ring-theme focus:ring-1"
        />
      </div>
    </div>
  );
};

export default PromoCard;
