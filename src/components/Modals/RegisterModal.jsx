import { useDispatch, useSelector } from "react-redux";
import {
  handleRestAll,
  toggleLoginModal,
  toggleRegisterModal,
} from "../../Redux/ModalSlice/ModalSlice";
import InputWithIcon from "../Input/InputwithIcon";
import Input from "../Input/Input";
import { handleUser } from "../../Data";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";
import { handleAsyncError } from "../../utils/handleAsyncError";

const RegisterModal = () => {
  const dispatch = useDispatch();
  const { isRegisterModalActive } = useSelector((state) => state.modals);
  const [loading, setLoading] = useState(false);

  const handleRegisterUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    const response = new FormData(e.target);
    let result = Object.fromEntries(response.entries());
    try {
      if (result) {
        const dataResponse = await handleUser("/signup", result);
        if (dataResponse.status == 200) {
          setLoading(false);
          handleAsyncError(dispatch, dataResponse?.message, "success");
          handleLoginModal();
        } else {
          setLoading(false);
          handleAsyncError(dispatch, dataResponse?.message);
        }
      } else {
        setLoading(false);
        handleAsyncError(dispatch, "all fields are required.");
      }
    } catch (error) {
      setLoading(false);
      return handleAsyncError(dispatch, error?.message);
    }
  };

  const handleLoginModal = () => {
    dispatch(toggleRegisterModal());
    dispatch(toggleLoginModal());
  };

  return (
    <>
      <div
        className={`fixed ${
          !isRegisterModalActive && "hidden"
        } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
      >
        <div className="relative top-20 mx-auto shadow-xl rounded bg-white max-w-md">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="font-bold text-2xl uppercase">
              Sign <span className="text-theme">Up</span>
            </h2>
            <button
              onClick={() => dispatch(toggleRegisterModal())}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div className="p-6 pt-5 text-center">
            <form onSubmit={handleRegisterUser} className="mb-8">
              <div className="flex justify-between gap-2 mb-5">
                <div className="flex-1">
                  <Input
                    name={"firstName"}
                    type="text"
                    placeholderDesc={"Enter First Name"}
                    modalRef={isRegisterModalActive}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name={"lastName"}
                    type="text"
                    placeholderDesc={"Enter Last Name"}
                  />
                </div>
              </div>
              <div className="mb-5">
                <Input
                  name={"email"}
                  type="email"
                  placeholderDesc={"Enter Email Address"}
                />
              </div>
              <div className="mb-5">
                <InputWithIcon name={"contact"} />
              </div>
              <button
                className="px-6 py-3.5 bg-theme w-full text-gray-100 font-semibold mt-6 rounded-lg disabled:bg-gray-400 uppercase"
                disabled={loading}
              >
                {loading ? <Spinner message={"Signing Up"} /> : " Sign up"}
              </button>
              <p className="mt-4 text-sm text-gray-600">
                By signing up, I accept the{" "}
                <span className="text-theme cursor-pointer hover:text-theme-dark hover:underline transition duration-300 ease-in-out">
                  Terms and Conditions
                </span>
              </p>
            </form>

            {/* <div className="border-6 w-[50%] border-theme mx-auto h-1"></div> */}

            <p className="text-left">
              Already have an account?{" "}
              <button
                className="uppercase text-theme font-semibold text-sm hover:text-theme-dark transition duration-300 ease-in-out"
                onClick={handleLoginModal}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterModal;
