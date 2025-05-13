import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import BannerImg from "../../assets/images/hero-banner.jpg";
import { useRef } from "react";

const Slider = () => {
  const images = [
    {
      image: BannerImg,
      text: "Explore the Beauty of Nature",
    },
    {
      image: BannerImg,
      text: "Adventure Awaits in the Wild",
    },
    {
      image: BannerImg,
      text: "Find Peace in the Outdoors",
    },
  ];
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <div className="w-full relative">
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
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="h-full lg:h-[72vh]"
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full brightness-90">
              <img
                src={slide.image}
                className="w-full h-full object-cover"
                alt={`BANNER_${index + 1}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
