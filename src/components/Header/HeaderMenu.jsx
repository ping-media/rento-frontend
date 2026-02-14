import React from "react";
import { NavLink } from "react-router-dom";

const HeaderMenu = ({ menu }) => {
  return (
    <ul className="items-center gap-4 hidden lg:flex">
      {menu.map((item, index) => (
        <NavLink
          to={`${item?.link}`}
          key={index}
          className={({ isActive }) =>
            `capitalize transition-all duration-200 ease-in-out text-white px-2 py-1 rounded-none ${
              isActive
                ? "border-b-2 border-theme"
                : "hover:text-theme hover:border-b-2 border-theme"
            }`
          }
        >
          <li className="w-full">{item?.title}</li>
        </NavLink>
      ))}
    </ul>
  );
};

export default React.memo(HeaderMenu);
