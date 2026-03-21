import React from "react";
import star from "../../assets/icons/star.webp";
import ActivaImage from "../../assets/images/activa.webp";
import heroImage from "../../assets/images/hero-banner.webp";

const stars = [1, 2, 3, 4, 5];

const HeroSection = () => {
  return (
    <div className="relative w-full h-full lg:h-[72vh]">
      <img
        width="600"
        height="400"
        src={heroImage}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
        decoding="async"
      />

      {/* overlay on top of image */}
      <div className="absolute inset-0 bg-black/75 pointer-events-none" />

      {/* Content goes here */}
      <div className="relative z-10 flex h-full text-white flex-wrap px-8 lg:px-20 py-10 gap-5 lg:gap-0">
        <div className="flex flex-1 items-center justify-center">
          <div className="leading-relaxed px-6">
            <p className="text-md lg:text-lg font-semibold">
              Bike & Scooter Rental In Bangalore, Hubli & Gulbarga
            </p>
            <h1 className="text-4xl lg:text-7xl font-bold">Rento Bikes</h1>
            <h2 className="text-md lg:text-xl mb-2">
              Ride your way, Anytime & Anywhere
            </h2>
            <p className="hidden lg:block">
              Looking for bike rental in Bangalore, Hubli, or Gulbarga? Rento
              Bikes offers well-maintained scooters and motorcycles for daily,
              weekly, and monthly rental plans. Since 2016, we have been helping
              customers travel conveniently with affordable pricing, flexible
              booking, and trusted service across major cities.
            </p>
          </div>
        </div>
        <div className="relative flex-1 -mt-10">
          <div className="relative w-72 lg:w-[24.5rem] 2xl:w-[26.5rem] mt-3 mx-auto bg-theme p-1 lg:p-2 rounded-full">
            {/* static rating */}
            <div className="absolute w-28 lg:w-40 bg-white/20 top-3 lg:top-9 right-0 backdrop-blur-md border border-gray-100 rounded-md p-1 lg:p-2">
              <p className="italic font-semibold mb-1.5">Rating</p>
              <div className="flex items-center gap-1">
                {stars.map((index) => (
                  <img
                    src={star}
                    className="size-4 object-cover"
                    alt={`star_${index}`}
                    key={index}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
            <img
              src={ActivaImage}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              alt="BIKE"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeroSection);
