import { Link } from "react-router-dom";
import {
  quickLink,
  socialIcons,
  contactUsFooterLink,
} from "../../Data/dummyData";
import logoImg from "../../assets/logo/rento-logo.png";
import playStore from "../../assets/playStore.png";
import { memo } from "react";

const Footer = () => {
  return (
    <footer className="bg-theme-black crusor-default">
      <div className="w-[95%] lg:w-[80%] mx-auto pt-6 pb-3.5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
          <div className="">
            <div className="w-20 h-20 lg:w-24 lg:h-24 p-1.5 rounded-full bg-white mb-3">
              <Link to={"/"} className="w-full">
                <img
                  src={logoImg}
                  className="w-full h-full object-contain"
                  alt="RENTOBIKES"
                />
              </Link>
            </div>
            <p className="text-sm text-white text-left mb-3">
              We have been successfully delivering bike rental services since
              August 2016. We focus on making your travel plan come true by
              offering you affordable with hygienic interior and maintained
              services.
            </p>
            {/* social icons  */}
            <div className="flex items-center gap-4">
              {socialIcons.map((item, index) => (
                <a
                  href={item.link}
                  target="_blank"
                  key={index}
                  className="size-5 group"
                >
                  <img
                    src={item.icon}
                    className="w-full h-full object-cover invert group-hover:scale-110 transition-all duration-300 ease-in-out"
                    alt={item.label}
                  />
                </a>
              ))}
            </div>
          </div>
          {/* quick links  */}
          <div>
            <h2 className="text-xl text-white font-bold mb-3">Quick Links</h2>
            <ul className="leading-10">
              {quickLink?.map((item, index) => (
                <li
                  key={index}
                  className="text-white hover:text-gray-300 hover:ml-2 transition-all ease-in-out duration-300"
                >
                  <Link to={`${item?.link}`}>{item?.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          {/* contact us links  */}
          <div>
            <h2 className="text-xl text-white font-bold mb-3">Contact Us</h2>
            <ul className="leading-10">
              {contactUsFooterLink?.map((item, index) => (
                <li
                  key={index}
                  className="text-white hover:text-gray-300 transition-all ease-in-out duration-300"
                >
                  {item?.link ? (
                    <a href={item.link} className="flex items-center gap-2">
                      <div className="text-theme">{item.icon}</div>
                      {item?.value}
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 cursor-pointer">
                      <div className="text-theme">{item.icon}</div>
                      {item?.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-gray-100 text-base">
              Download the app by clicking the link below:
            </p>
            {/* <a href="#" target="_blank"> */}
            <div className="w-36 my-5">
              <img
                src={playStore}
                className="w-full h-full object-cover"
                alt="RENTO_PLAYSTORE"
              />
            </div>
            {/* </a> */}
          </div>
        </div>
        <div className="flex items-center justify-center lg:pt-0 mt-5 lg:mt-0 border-t border-gray-500 text-white">
          <p className="order-2 lg:order-1 cursor-default pt-2">
            <span className="font-bold cursor-pointer">
              &copy; 2016 - {new Date().getFullYear()}
              <Link
                to={"/"}
                className="hover:text-theme mx-1 transition-all duration-300 ease-in-out"
              >
                Rento Bikes.
              </Link>
            </span>
            All Rights Reserved By{" "}
            <span className="text-semibold">
              Bongi Mobility Solutions Private Limited
            </span>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
