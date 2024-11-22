import { useSelector } from "react-redux";
import { showGreeting } from "../../utils";

const SigninButton = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <button className="flex items-center gap-1.5 px-4 py-2 lg:py-1 bg-theme text-gray-100 rounded-md uppercase font-semibold hover:bg-theme-dark w-full">
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
          viewBox="0 0 24 24"
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
      </span>
      <div className="text-left">
        <small>{showGreeting()},</small>
        <p className="font-semibold text-xl">{currentUser?.firstName}</p>
      </div>
    </button>
  );
};

export default SigninButton;
