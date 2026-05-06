import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { shallowEqual, useSelector } from "react-redux";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  const { testimonial } = useSelector((state) => state.general, shallowEqual);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // for fetching google reviews
  // `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`

  return (
    <div className="w-full pt-8 pb-5 mt-5">
      <h2 className="text-xl lg:text-3xl mb-5 text-center font-bold">
        Testimonials
      </h2>
      <div className="w-[95%] lg:w-[90%] px-2 lg:px-0 mx-auto">
        <div className="relative w-full h-full">
          <button
            ref={prevRef}
            className={`absolute z-10 -left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 ${
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
            className={`absolute z-10 -right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 ${
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
            {testimonial.map((item) => (
              <SwiperSlide key={item._id} className="mb-4 h-full">
                <TestimonialCard {...item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
