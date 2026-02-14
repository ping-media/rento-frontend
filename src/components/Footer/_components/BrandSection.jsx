import { memo } from "react";
import { Link } from "react-router-dom";
import logoImg from "../../../assets/rento-full-light.webp";
import { socialIcons } from "../../../Data/dummyData";

const BrandSection = memo(({ socialmedia }) => {
  return (
    <div>
      <div className="w-4/5 mb-2">
        <Link to={"/"} className="max-h-8 md:max-h-10 lg:max-h-16">
          <img
            src={logoImg}
            className="w-full h-full object-contain"
            alt="RENTOBIKES"
          />
        </Link>
      </div>
      <p className="text-sm text-white text-left mb-3">
        We have been successfully delivering bike rental services since August
        2016. We focus on making your travel plan come true by offering you
        affordable with hygienic interior and maintained services.
      </p>
      {/* social icons  */}
      <div className="flex items-center gap-4">
        {Object.entries(socialmedia).map(([key, value], index) => {
          if (value === "#") {
            return null;
          }
          return (
            <a
              href={value}
              target="_blank"
              key={index}
              className="size-5 group"
            >
              <img
                src={socialIcons[key]}
                className="w-full h-full object-cover invert group-hover:scale-110 transition-all duration-300 ease-in-out"
                alt={key}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
});

export default BrandSection;
