import React from "react";
import { NavLink } from "react-router-dom";

const HeaderMenu = ({ menu }) => {
  return (
    <ul className="items-center gap-4 hidden lg:flex">
      {menu.map((item, index) => (
        <li key={index}>
          <NavLink
            to={`${item?.link}`}
            className={({ isActive }) =>
              `w-full capitalize transition-all duration-200 ease-in-out text-white px-2 py-1 rounded-none ${
                isActive
                  ? "border-b-2 border-theme"
                  : "hover:border-b-2 border-theme"
              }`
            }
          >
            {item?.title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default React.memo(HeaderMenu);
