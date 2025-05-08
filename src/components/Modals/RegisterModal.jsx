import { useDispatch, useSelector } from "react-redux";
import {
  toggleLoginModal,
  toggleRegisterModal,
} from "../../Redux/ModalSlice/ModalSlice";
import InputWithIcon from "../Input/InputwithIcon";
import Input from "../Input/Input";
import { handleUser } from "../../Data";
import { useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";
import { handleAsyncError } from "../../utils/handleAsyncError";
import VerifyOtp from "../Auth/VerifyOtp";
import { removeTempContact } from "../../Redux/UserSlice/UserSlice";
import { useNavigate } from "react-router-dom";

const RegisterModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRegisterModalActive } = useSelector((state) => state.modals);
  const [isverfiyOtpActive, setIsVerfiyOtpActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [inputNumber, setInputNumber] = useState(null);
  const [loadings, setLoadings] = useState(false);

  const handleRegisterUser = async (e) => {
    setLoadings(true);
    e.preventDefault();
    const response = new FormData(e.target);
    let result = Object.fromEntries(response.entries());
    try {
      if (result) {
        const dataResponse = await handleUser("/signup", result);
        if (dataResponse.status == 200) {
          const response = await handleUser("/otpGenerat", {
            contact: result?.contact,
          });
          if (response?.status == 200) {
            handleAsyncError(dispatch, response?.message, "success");
            setIsVerfiyOtpActive(true);
            setInputNumber(result?.contact);
            setSeconds(30);
            setIsTimerActive(true);
          } else {
            handleAsyncError(dispatch, response?.message);
          }
        } else {
          handleAsyncError(dispatch, dataResponse?.message);
        }
        setLoadings(false);
      } else {
        setLoadings(false);
        handleAsyncError(dispatch, "all fields are required.");
      }
    } catch (error) {
      setLoadings(false);
      return handleAsyncError(dispatch, error?.message);
    }
  };

  //this function is to change for login to signup
  const handleLoginModal = () => {
    dispatch(toggleRegisterModal());
    dispatch(toggleLoginModal());
  };

  // remove the tempnumber after close the register modal
  useEffect(() => {
    if (isRegisterModalActive == false) {
      dispatch(removeTempContact());
    }
  }, [isRegisterModalActive]);

  // sending the user to term & condition page and close modal
  const handleChangeLink = () => {
    dispatch(toggleRegisterModal(false));
    return navigate("/terms-and-conditions");
  };

  return (
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
        <div className="p-6 text-center">
          {!isverfiyOtpActive ? (
            <>
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
                  disabled={loadings}
                >
                  {loadings ? <Spinner message={"Signing Up"} /> : " Sign up"}
                </button>
                <p className="mt-4 text-sm text-gray-600">
                  By signing up, I accept the{" "}
                  <button
                    onClick={handleChangeLink}
                    type="button"
                    className="text-theme cursor-pointer hover:text-theme-dark hover:underline transition duration-300 ease-in-out"
                  >
                    Terms and Conditions
                  </button>
                </p>
              </form>

              <p className="text-left">
                Already have an account?{" "}
                <button
                  className="uppercase text-theme font-semibold text-sm hover:text-theme-dark transition duration-300 ease-in-out"
                  onClick={handleLoginModal}
                >
                  Sign In
                </button>
              </p>
            </>
          ) : (
            <VerifyOtp
              phone={inputNumber}
              setOtpValue={setIsVerfiyOtpActive}
              setInputValue={setInputNumber}
              modalChange={toggleRegisterModal}
              seconds={seconds}
              setSecondChanger={setSeconds}
              isTimerActive={isTimerActive}
              setTimerActive={setIsTimerActive}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
