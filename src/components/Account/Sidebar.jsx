import { Link, useLocation } from "react-router-dom";
import { showGreeting } from "../../utils";
import RideImg from "../../assets/logo/road.png";
import UserImg from "../../assets/logo/user.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SideBar = () => {
  const menuList = [
    { menuImg: UserImg, title: "Profile", link: "/profile" },
    { menuImg: RideImg, title: "MyRides", link: "/my-rides" },
  ];
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  // to change active page class
  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  return (
    <div className="border-2 px-4 py-2 rounded-lg shadow-md bg-white">
      <div className="flex items-center gap-4 pb-2 border-gray-400 border-b-2">
        <div className="w-14 h-14">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-full h-full object-cover"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
            <circle cx="12" cy="10" r="3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div>
          {/* greeting message */}
          <p className="text-sm text-gray-500">{showGreeting()},</p>
          <h2 className="font-semibold uppercase text-xl">
            {currentUser?.firstName}
          </h2>
        </div>
      </div>
      <ul className="px-4 my-2 leading-10">
        {menuList.map((item, index) => (
          <Link to={item?.link} key={index}>
            <li
              className={`flex items-center gap-2 my-2 group hover:bg-theme hover:text-gray-100 transition duration-200 ease-in-out rounded-lg ${
                currentPage === item?.link ? "bg-theme text-gray-100" : ""
              }`}
            >
              <div className="w-10 h-10 p-1 bg-theme my-1 rounded-lg bg-opacity-50">
                <img
                  src={item?.menuImg}
                  className={`w-full h-full object-cover group-hover:invert ${
                    currentPage === item?.link ? "invert" : ""
                  }`}
                  alt={item?.title}
                />
              </div>
              {item?.title}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
