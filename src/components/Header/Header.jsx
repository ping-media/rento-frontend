import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  toggleLocationModal,
  toggleLoginModal,
  toggleSideBarModal,
} from "../../Redux/ModalSlice/ModalSlice";
import { menuList } from "../../Data/dummyData";
import LoggedInUserButton from "../Button/LoggedInUserButton";
import logoImg from "../../assets/logo/rento-logo.png";
import { memo, useEffect, useMemo } from "react";
import { handleSignOut } from "../../Redux/UserSlice/UserSlice";
import { handleUser } from "../../Data";

const Header = memo(() => {
  const dispatch = useDispatch();
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  const { currentUser } = useSelector((state) => state.user);
  const { isSideBarModalActive } = useSelector((state) => state.modals);

  // Validate user only when currentUser changes
  useEffect(() => {
    if (
      (currentUser && location.pathname == "/") ||
      location.pathname.includes("/booking/summary/")
    ) {
      const validateUser = async () => {
        const response = await handleUser("/validedToken", {
          _id: currentUser?._id,
        });
        if (response?.isUserValid !== true) {
          dispatch(handleSignOut());
        }
      };
      validateUser();
    }
  }, [currentUser, dispatch]);

  // Memoize sideMenuList to avoid unnecessary recalculations
  const sideMenuList = useMemo(() => {
    if (isSideBarModalActive) {
      return menuList;
    } else {
      return menuList.filter((list) => list.isPhone === false);
    }
  }, [isSideBarModalActive]);

  return (
    <div className="bg-theme-black">
      <div className="flex items-center justify-between w-[95%] lg:w-[90%] mx-auto py-2.5">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-gray-100"
            type="button"
            onClick={() => dispatch(toggleSideBarModal())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <Link
            to={"/"}
            className="w-12 h-12 lg:w-14 lg:h-14 p-1.5 rounded-full bg-white"
          >
            <img
              src={logoImg}
              className="w-full h-full object-contain"
              alt="RENTOBIKES"
            />
          </Link>
        </div>
        {/* menu list, location & login options */}
        <div className="flex items-center gap-4">
          <ul className="items-center gap-4 hidden lg:flex">
            {sideMenuList.map((item, index) => (
              <Link to={`${item?.link}`} key={index}>
                <li className="text-gray-100 capitalize hover:text-theme transition duration-200 ease-in-out">
                  {item?.title}
                </li>
              </Link>
            ))}
          </ul>
          <button
            className="border-2 border-theme px-4 py-2 text-gray-100 flex items-center gap-1.5 rounded-md uppercase"
            onClick={() => dispatch(toggleLocationModal())}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
              </svg>
            </span>
            {selectedLocation?.locationName || "Select Location"}
          </button>
          {currentUser == null ? (
            <button
              className="hidden lg:flex items-center gap-1.5 px-4  py-3 lg:py-2 bg-lighter-gray rounded-md uppercase font-semibold hover:bg-light-gray"
              onClick={() => dispatch(toggleLoginModal())}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <span>Sign In</span>
            </button>
          ) : (
            <LoggedInUserButton />
          )}
        </div>
      </div>
    </div>
  );
});

export default Header;
