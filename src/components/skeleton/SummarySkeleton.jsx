const SummarySkeleton = () => {
  return (
    <div className="w-[90%] mx-auto mt-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-4">
        <div className="col-span-7">
          <div className="mb-5 border-2 border-gray-300 rounded-lg py-2 px-4 bg-white shadow-md lg:h-[95%]">
            <div className="flex items-center justify-between py-3 border-b-2 border-gray-300">
              <div className="h-4 w-24 bg-gray-400 bg-opacity-50 rounded mb-1"></div>
              <div className="h-4 w-12 bg-gray-400 bg-opacity-50 rounded mb-1"></div>
            </div>
            <div className="flex justify-between flex-wrap mt-6 mb-4 px-4">
              <div className="w-52 h-40 mx-auto lg:mx-0 bg-gray-400 bg-opacity-50 rounded-lg"></div>
              <div className="max-w-sm">
                <div className="h-4 w-32 bg-gray-400 bg-opacity-50 rounded mb-3"></div>
                <div>
                  <div className="h-4 w-16 bg-gray-400 bg-opacity-50 rounded mb-2"></div>
                  <div className="h-4 w-52 bg-gray-400 bg-opacity-50 rounded mb-1"></div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-4 w-full mb-3">
                    <div>
                      <div
                        htmlFor="pickup"
                        className="h-4 w-14 bg-gray-400 bg-opacity-50 rounded mb-2"
                      ></div>
                      <div id="pickup" className="border-2 rounded-lg p-2">
                        <p className="h-4 w-20 bg-gray-400 bg-opacity-50 rounded mb-2"></p>
                        <p className="h-4 w-16 bg-gray-400 bg-opacity-50 rounded mb-2"></p>
                      </div>
                    </div>
                    <p className="h-4 w-10 bg-gray-400 bg-opacity-50 rounded mb-2"></p>
                    <div>
                      <div
                        className="h-4 w-14 bg-gray-400 bg-opacity-50 rounded mb-2"
                        htmlFor="drop"
                      ></div>
                      <div id="drop" className="border-2 rounded-lg p-2">
                        <p className="h-4 w-20 bg-gray-400 bg-opacity-50 rounded mb-2"></p>
                        <p className="h-4 w-16 bg-gray-400 bg-opacity-50 rounded mb-2"></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-4 w-28 bg-gray-400 bg-opacity-50 rounded mb-2"></div>
                <div>
                  <div className="h-4 w-28 bg-gray-400 bg-opacity-50 rounded mb-1"></div>
                  <div className="h-4 w-28 bg-gray-400 bg-opacity-50 rounded mb-1"></div>
                </div>
              </div>

              <div>
                <div className="h-4 w-20 bg-gray-400 bg-opacity-50 rounded mb-1"></div>
              </div>
            </div>
            <div className="border-t-2 border-gray-300 bg-white px-4 py-2">
              <h3 className="h-4 w-20 bg-gray-400 bg-opacity-50 rounded mb-3"></h3>
              <ul className="flex flex-wrap w-full gap-4 items-center">
                <li className="flex items-center w-full lg:w-[49%] gap-2">
                  <div className="h-4 w-40 bg-gray-400 bg-opacity-50 rounded mb-2"></div>
                </li>
                <li className="flex items-center w-full lg:w-[49%] gap-2">
                  <div className="h-4 w-52 bg-gray-400 bg-opacity-50 rounded mb-2"></div>
                </li>
                <li className="flex items-center w-full lg:w-[49%] gap-2">
                  <div className="h-4 w-48 bg-gray-400 bg-opacity-50 rounded mb-2"></div>
                </li>
                <li className="flex items-center w-full lg:w-[49%] gap-2">
                  <div className="h-4 w-40 bg-gray-400 bg-opacity-50 rounded mb-2"></div>
                </li>
                <li className="flex items-center w-full lg:w-[49%] gap-2">
                  <div className="h-4 w-40 bg-gray-400 bg-opacity-50 rounded mb-2"></div>
                </li>
                <li className="flex items-center w-full lg:w-[49%] gap-2">
                  <div className="h-4 w-40 bg-gray-400 bg-opacity-50 rounded mb-2"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="mb-5 border-2 bg-white border-gray-300 shadow-md rounded-lg py-2 px-4 relative">
            <div className="py-3 border-b-2 border-gray-300">
              <div className="h-4 w-20 bg-gray-400 bg-opacity-50 rounded mb-1"></div>
            </div>
            <>
              <div className="mt-6 mb-4 mb-5">
                <ul className="leading-10 pb-3 border-b-2 border-gray-300">
                  <li className="flex items-center justify-between">
                    <span className="h-4 w-24 bg-gray-400 bg-opacity-50 rounded mb-2"></span>{" "}
                    <span className="h-4 w-16 bg-gray-400 bg-opacity-50 rounded mb-2"></span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="h-4 w-24 bg-gray-400 bg-opacity-50 rounded mb-2"></span>{" "}
                    <span className="h-4 w-16 bg-gray-400 bg-opacity-50 rounded mb-2"></span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="h-4 w-24 bg-gray-400 bg-opacity-50 rounded mb-2"></span>{" "}
                    <span className="h-4 w-16 bg-gray-400 bg-opacity-50 rounded mb-2"></span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="h-4 w-24 bg-gray-400 bg-opacity-50 rounded mb-2"></span>{" "}
                    <span className="h-4 w-16 bg-gray-400 bg-opacity-50 rounded mb-2"></span>
                  </li>
                </ul>
                <div className="flex items-center justify-between py-2">
                  <span className="h-4 w-24 bg-gray-400 bg-opacity-50 rounded mb-2"></span>
                  <span className="h-4 w-16 bg-gray-400 bg-opacity-50 rounded mb-2"></span>
                </div>
              </div>
              <div className="bg-gray-200 -mx-4 px-4 pt-2 -mb-2 rounded-b-lg">
                <div className="h-4 w-28 bg-gray-400 bg-opacity-50 rounded mb-2"></div>
                <div className="h-3 w-36 bg-gray-400 bg-opacity-50 rounded pb-2"></div>
              </div>
            </>
          </div>
          <div className="border-2 border-gray-300 rounded-lg bg-white shadow-md border-t-0">
            <div className="bg-gray-200 rounded-t-lg mb-3 px-4 py-2">
              <h3 className="h-4 w-20 bg-gray-400 bg-opacity-50 rounded"></h3>
            </div>
            <div className="h-6 w-90 bg-gray-400 bg-opacity-50 rounded mb-2 mx-4"></div>
          </div>
          <div className="mb-5 border-2 border-gray-300 rounded-lg py-2 px-4 bg-white shadow-md mt-2">
            <div className="h-4 w-11/12 bg-gray-400 bg-opacity-50 rounded mb-3"></div>
            <div className="h-4 w-10/12 bg-gray-400 bg-opacity-50 rounded"></div>
          </div>
          <button
            className="w-full rounded-lg mt-1 bg-gray-400 bg-opacity-50 h-14"
            disabled
          ></button>
        </div>
      </div>
    </div>
  );
};

export default SummarySkeleton;
