import { useSelector } from "react-redux";
import { useMemo, useRef, useState } from "react";
import activaImg from "../../assets/images/activa.webp";
import fascinoImg from "../../assets/images/fascino.webp";
import cliqImg from "../../assets/images/cliq.webp";
import hornetImg from "../../assets/images/Hornet.webp";
import {
  addDaysToDateForRide,
  convertToISOString,
  formatDate,
  formatNumber,
  formatTimeWithoutSeconds,
} from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link, useLocation } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import PackageSkeleton from "../skeleton/PackageSkeleton";

// const images = [bikeImg, ScooterImg];
const images = [activaImg, fascinoImg, cliqImg, hornetImg];

const Package = () => {
  const { filter, filterLoading } = useSelector((state) => state.filter);
  const { selectedStation, stationLoading } = useSelector(
    (state) => state.station,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const location = useLocation();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { pickupDateAndTime, currentTime } = useMemo(() => {
    const now = new Date();
    const time = formatTimeWithoutSeconds(
      now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    );

    return {
      currentTime: time,
      pickupDateAndTime: convertToISOString(formatDate(now), time),
    };
  }, [location.pathname]);

  const baseDate = useMemo(() => new Date(), []);

  const slides = useMemo(
    () =>
      filter.slice(0, 8).map((pkg, index) => {
        const endDate = convertToISOString(
          addDaysToDateForRide(pkg.planDuration, formatDate(baseDate)),
          currentTime,
        );
        const isPackageTextInclude = pkg.planName
          ?.toLowerCase()
          .includes("package");

        return (
          <SwiperSlide key={pkg._id} className="mb-4">
            <Link
              to={`/search/${selectedStation?.stationId}?BookingStartDateAndTime=${pickupDateAndTime}&BookingEndDateAndTime=${endDate}&vehiclePlan=${pkg._id}`}
            >
              {/* new card layout  */}
              <div className="relative rounded-lg overflow-hidden shadow-md bg-white">
                {/* dotted pattern background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,_#94a3b8_0.9px,_transparent_0.9px)] bg-[length:8px_8px] opacity-20 pointer-events-none" />

                {/* image */}
                <div className="p-4">
                  <div className="relative z-10 w-full bg-white p-2.5 border rounded-lg h-44">
                    <img
                      src={images[index % images.length]}
                      loading="lazy"
                      alt="Vehicle"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* content */}
                <div className="relative z-10 px-4 pb-4 text-center">
                  <h2
                    className="text-base capitalize font-semibold text-gray-800 line-clamp-1"
                    title={pkg.planName}
                  >
                    {pkg.planName}
                    {!isPackageTextInclude && " Package"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    Starting From{" "}
                    <span className="text-lg font-bold text-theme">
                      ₹{formatNumber(pkg.planPrice)}
                    </span>
                  </p>

                  {/* button */}
                  <button className="mt-3 w-full bg-theme hover:bg-theme/95 text-white py-2 rounded-md font-medium transition">
                    Rent Now
                  </button>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        );
      }),
    [filter, pickupDateAndTime, currentTime, selectedStation?.stationId],
  );

  if (filterLoading || stationLoading) {
    return <PackageSkeleton />;
  }

  if (!filter?.length) return null;

  return (
    <div className="w-full pt-8 pb-5 mt-5">
      <h2 className="text-xl lg:text-3xl mb-5 text-center font-bold">
        Long Duration Packages
      </h2>

      <div className="w-[95%] lg:w-[90%] mx-auto relative">
        {/* Navigation buttons */}
        <button
          ref={prevRef}
          // hidden md:block
          className={`absolute z-10 -left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow ${
            isBeginning ? "opacity-0 pointer-events-none" : ""
          }`}
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
          // hidden md:block
          className={`absolute z-10 -right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow ${
            isEnd ? "opacity-0 pointer-events-none" : ""
          }`}
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
            // swiper.params.navigation.prevEl = prevRef.current;
            // swiper.params.navigation.nextEl = nextRef.current;
            setTimeout(() => {
              if (swiper.params.navigation) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            });
          }}
          onSwiper={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          className="w-full h-full"
        >
          {slides}
        </Swiper>
      </div>
    </div>
  );
};

export default Package;
