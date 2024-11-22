import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleSignOutModal } from "../../Redux/ModalSlice/ModalSlice";

const LoggedInUserButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const adminRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  //for dropdown menu
  useEffect(() => {
    if (isVisible) {
      setIsVisible(!isVisible);
    }
  }, [window.location.href]);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // for closing dropdown menu when user click outside anywhere on screen
  const handleClickOutside = (event) => {
    if (adminRef.current && !adminRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <button
      className="hidden lg:flex relative hover:shadow-none shadow-md bg-lighter-gray rounded-xl cursor-pointer items-center gap-2 px-3 py-2"
      ref={adminRef}
      onClick={handleToggleVisibility}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-8 h-8 rounded-xl"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      <div>
        <h2 className="font-semibold text-md lg:text-lg capitalize">
          {currentUser?.contact && currentUser?.firstName}
        </h2>
      </div>
      {isVisible && (
        <div className="absolute w-40 top-16 right-0 bg-white flex flex-col items-center text-left gap-2 border border-gray-200 rounded-xl p-2 shadow-xl z-50">
          <Link
            className="py-1.5 px-1.5 hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-ou w-full"
            to={"/profile"}
          >
            <span className="inline-flex mr-1">
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </span>
            Profile
          </Link>
          <Link
            className="py-1.5 px-1.5 hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-out w-full"
            to={"/my-rides"}
          >
            <span className="inline-flex mr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  fill="currentColor"
                  d="M16 1a1 1 0 0 1 1 1v1h5v6h-2.019l2.746 7.544a4 4 0 1 1-7.6 2.456h-4.253a4.002 4.002 0 0 1-7.8-.226A2 2 0 0 1 2 17V7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V3h-3V1h4ZM7 16a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm12-.001a2 2 0 1 0 1.88 1.316l-.017-.044A2 2 0 0 0 19 16ZM17.853 9H17v3a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3H4v3.354A4.002 4.002 0 0 1 10.874 17h4.252a4.002 4.002 0 0 1 4.568-2.94L17.853 9ZM9 8H4v2h5V8Zm11-3h-3v2h3V5Z"
                ></path>
              </svg>
            </span>
            My Rides
          </Link>
          <Link
            className="py-1.5 px-1.5 hover:bg-theme rounded-md hover:text-white transition duration-200 ease-in-ou w-full"
            onClick={() => dispatch(toggleSignOutModal())}
          >
            <span className="inline-flex mr-1">
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
            </span>
            Logout
          </Link>
        </div>
      )}
    </button>
  );
};

export default LoggedInUserButton;
