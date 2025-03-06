import React from "react";
import { Link } from "react-router-dom";

const CallToActionButton = ({
  image,
  link,
  target = "_blank",
  label = "CALLTOACTION",
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 w-14 h-14">
      <div className="relative bg-[#55CD6C] rounded-full p-3 animate-ping w-full h-full"></div>
      <Link to={link} target={target} className="absolute top-0 right-0">
        <img src={image} className="w-full h-full object-cover" alt={label} />
      </Link>
    </div>
  );
};

export default CallToActionButton;
