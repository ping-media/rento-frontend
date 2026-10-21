import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  handleRestAll,
  toggleLoginModal,
  toggleSideBarModal,
  toggleSignOutModal,
} from "../../Redux/ModalSlice/ModalSlice";
import { menuList } from "../../Data/dummyData";
import logoImg from "../../assets/rento-full-light.webp";
import SigninButton from "../Button/SigninButton";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMainSideBarActive } = useSelector((state) => state.modals);
  const { currentUser } = useSelector((state) => state.user);

  const handleOpenLoginModal = () => {
    dispatch(toggleSideBarModal());
    dispatch(toggleLoginModal());
  };

  const handleNavigation = (link) => {
    dispatch(handleRestAll());
    navigate(link);
  };

  return (
    <div
      className={`${
        isMainSideBarActive ? "left-0" : "left-[-100%]"
      } fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-40 transition-all duration-300 ease-in-out`}
    >
      <div className="w-[80%] bg-white h-full">
        <div className="bg-theme-black px-4 py-2.5 flex items-center justify-between mb-3">
          <Link to={"/"} className="w-full h-9 lg:h-12">
            <img
              src={logoImg}
              className="w-full h-full object-contain object-[left_center]"
              alt="RENTOBIKES"
            />
          </Link>
          <button
            className="text-gray-100"
            onClick={() => dispatch(toggleSideBarModal())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="px-4 py-2">
          <div className="border-b-2 border-gray-400 pb-3 mb-5">
            {currentUser == null ? (
              <button
                className="flex items-center gap-1.5 px-4 py-3 lg:py-2 bg-theme text-gray-100 rounded-md uppercase font-semibold hover:bg-theme-dark w-full"
                onClick={handleOpenLoginModal}
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
              <SigninButton />
            )}
          </div>
          <ul className="leading-10">
            {menuList
              .filter((list) => currentUser != null || list.isPhone === false)
              .map((item, index) => (
                <li key={index}>
                  <button
                    className={`capitalize font-semibold flex items-center justify-between w-full ${item?.title == "Logout" ? "bg-theme text-white px-2 rounded-md" : ""}`}
                    type="button"
                    onClick={
                      item?.title == "Logout"
                        ? () => dispatch(toggleSignOutModal())
                        : () => handleNavigation(item?.link)
                    }
                  >
                    {item?.title}
                    {item?.title !== "Logout" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
