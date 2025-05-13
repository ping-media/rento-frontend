import { useSelector } from "react-redux";
import bikeImg from "../../assets/images/bike.png";
import ScooterImg from "../../assets/images/rental.png";
import {
  addDaysToDateForRide,
  convertToISOString,
  formatDate,
  formatNumber,
  formatTimeWithoutSeconds,
} from "../../utils";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import PreLoader from "../skeleton/PreLoader";

const Package = () => {
  const { filter, filterLoading } = useSelector((state) => state.filter);
  const { selectedStation, stationLoading } = useSelector(
    (state) => state.station
  );
  const [pickupDateAndTime, setPickupDateAndTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const images = [bikeImg, ScooterImg];

  useEffect(() => {
    const now = new Date();
    const formattedTime = formatTimeWithoutSeconds(
      now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );
    setCurrentTime(formattedTime);
    setPickupDateAndTime(
      convertToISOString(formatDate(new Date()), formattedTime)
    );
  }, [location.pathname]);

  if (!pickupDateAndTime || !currentTime || filterLoading || stationLoading) {
    return <PreLoader />;
  }
  return (
    filter?.length > 0 && (
      <div className="w-full pt-8 pb-5 mt-5">
        <h2 className="text-xl lg:text-3xl mb-5 text-center font-bold">
          Long Duration Packages
        </h2>
        <div className="w-[95%] lg:w-[90%] px-4 lg:px-0 lg:mx-auto">
          <div className="relative w-full h-full">
            <button
              ref={prevRef}
              className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              ref={nextRef}
              className="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              className="w-full h-full"
            >
              {filter.map((pkg, index) => (
                <SwiperSlide key={pkg._id} className="mb-4">
                  <Link
                    to={`/search/${
                      selectedStation?.stationId
                    }?BookingStartDateAndTime=${pickupDateAndTime}&BookingEndDateAndTime=${convertToISOString(
                      addDaysToDateForRide(
                        pkg?.planDuration,
                        formatDate(new Date())
                      ),
                      currentTime
                    )}&vehiclePlan=${pkg?._id}`}
                  >
                    {/* <div className="flex items-center rounded-md overflow-hidden shadow-md bg-white px-4">
                      <div className="w-20 h-20">
                        <img
                          src={images[index % images.length]}
                          alt="Vehicle"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h2 className="text-lg font-extrabold uppercase text-gray-700">
                            {pkg.planName} Package
                          </h2>
                          <p className="text-sm mt-3">
                            From{" "}
                            <span className="text-lg font-bold text-theme">
                              ₹{formatNumber(pkg.planPrice)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div> */}
                    <div className="relative rounded-md overflow-hidden shadow-md bg-white px-4">
                      {/* More visible dot pattern */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle,_#94a3b8_0.9px,_transparent_0.9px)] bg-[length:8px_8px] opacity-30 pointer-events-none"></div>

                      {/* Foreground content */}
                      <div className="flex items-center relative z-10">
                        <div className="w-20 h-20">
                          <img
                            src={images[index % images.length]}
                            alt="Vehicle"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1 p-3 flex flex-col justify-between">
                          <div>
                            <h2 className="text-lg font-extrabold uppercase text-gray-700">
                              {pkg.planName} Package
                            </h2>
                            <p className="text-sm mt-3">
                              From{" "}
                              <span className="text-lg font-bold text-theme">
                                ₹{formatNumber(pkg.planPrice)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    )
  );
};

export default Package;
