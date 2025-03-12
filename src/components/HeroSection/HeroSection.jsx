import star from "../../assets/icons/star.png";
import halfStar from "../../assets/icons/rating.png";

const HeroSection = ({ imageUrl, secondImgeUrl }) => {
  return (
    <div className="relative w-full h-full lg:h-[72vh]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-black/75" />

      {/* Content goes here */}
      <div className="relative z-10 flex h-full text-white flex-wrap px-8 lg:px-20 py-10 gap-5 lg:gap-0">
        <div className="flex flex-1 items-center justify-center">
          <div className="leading-relaxed px-6">
            <p className="text-md lg:text-lg font-semibold">
              Rent Bikes & Scooty At
            </p>
            <h1 className="text-4xl lg:text-7xl font-bold">Rento Bikes</h1>
            <h2 className="text-md lg:text-xl mb-2">
              Ride your way, Anytime & Anywhere
            </h2>
            <p className="hidden lg:block">
              India's premier two wheeler rental service provides a wide
              selection of vehicles available for rent. Our company is
              recognized as one of the top rental providers in India,
              distinguished by our tailored services and strong dedication to
              customer satisfaction.
            </p>
          </div>
        </div>
        <div className="relative flex-1 -mt-10">
          <div className="relative w-72 lg:w-[28rem] mt-3 mx-auto bg-theme p-1 lg:p-2 rounded-full">
            {/* static rating  */}
            <div className="absolute w-28 lg:w-40 bg-white/20 top-3 lg:top-9 right-0 backdrop-blur-md border border-gray-100 rounded-md p-1 lg:p-2">
              <p className="italic font-semibold mb-1.5">Rating</p>
              <div className="flex items-center gap-1">
                {new Array(4).fill(undefined).map((_, index) => (
                  <img
                    src={star}
                    className="size-4 object-cover"
                    alt={`star_${index + 1}`}
                    key={index}
                  />
                ))}
                <img
                  src={halfStar}
                  className="size-4 object-cover"
                  alt="star_5"
                />
              </div>
            </div>
            <img
              src={secondImgeUrl}
              className="w-full h-full object-cover"
              loading="lazy"
              alt="BIKE"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
