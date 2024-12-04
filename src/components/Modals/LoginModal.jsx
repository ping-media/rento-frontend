import { useDispatch, useSelector } from "react-redux";
import {
  toggleLoginModal,
  toggleRegisterModal,
} from "../../Redux/ModalSlice/ModalSlice";
import InputWithIcon from "../Input/InputwithIcon";
import { useState } from "react";
import VerifyOtp from "../Auth/VerifyOtp";
import Spinner from "../Spinner/Spinner";
import { handleUser } from "../../Data";
import { handleAsyncError } from "../../utils/handleAsyncError";

const LoginModal = () => {
  const dispatch = useDispatch();
  const { isLoginModalActive } = useSelector((state) => state.modals);
  const [loading, setLoading] = useState(false);
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [inputNumber, setInputNumber] = useState("");

  const handleLoginUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    const response = new FormData(e.target);
    let result = Object.fromEntries(response.entries());
    if (result) {
      const response = await handleUser("/optGernet", result);
      // console.log(response);
      if (response.status != 200) {
        handleRegisterModal();
        handleAsyncError(dispatch, response?.message);
      } else {
        setInputNumber(result?.contact);
        setIsOtpSend(true);
        handleAsyncError(dispatch, response?.message, "success");
      }
      return setLoading(false);
    }
  };

  const handleRegisterModal = () => {
    dispatch(toggleLoginModal());
    dispatch(toggleRegisterModal());
  };

  return (
    <>
      <div
        className={`fixed ${
          !isLoginModalActive && "hidden"
        } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
      >
        <div className="relative top-20 mx-auto shadow-xl rounded bg-white max-w-md">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="font-bold text-2xl uppercase">
              Sign <span className="text-theme">In</span>
            </h2>
            <button
              onClick={() => dispatch(toggleLoginModal())}
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

          <div className="p-6 pt-0 text-center">
            {!isOtpSend ? (
              <>
                <form onSubmit={handleLoginUser} className="mb-8">
                  <InputWithIcon
                    name={"contact"}
                    modalRef={isLoginModalActive}
                  />
                  <button
                    className="px-6 py-3.5 bg-theme w-full text-gray-100 font-semibold mt-6 rounded-lg disabled:bg-gray-400 uppercase"
                    disabled={loading}
                  >
                    {!loading ? "Sign In" : <Spinner message={"loading"} />}
                  </button>
                </form>

                <p className="text-left">
                  Don't have an account?{" "}
                  <button
                    className="uppercase text-theme font-semibold text-sm hover:text-theme-dark transition duration-300 ease-in-out"
                    onClick={handleRegisterModal}
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <VerifyOtp
                otp={123456}
                phone={inputNumber}
                setOtpValue={setIsOtpSend}
                setInputValue={setInputNumber}
                modalChange={toggleLoginModal}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
