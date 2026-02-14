import React from "react";
import { Link } from "react-router-dom";

const Copyright = React.memo(() => {
  return (
    <div className="flex items-center justify-center lg:pt-0 mt-5 lg:mt-0 border-t border-gray-500 text-white">
      <p className="order-2 lg:order-1  text-center cursor-default pt-2">
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
  );
});

export default Copyright;
