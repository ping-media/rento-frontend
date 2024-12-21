import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Spinner from "../Spinner/Spinner";
// import { toggleLoginModal } from "../../Redux/ModalSlice/ModalSlice";
import { handleUser } from "../../Data";
import {
  // handleLoadingUserData,
  handleSignIn,
} from "../../Redux/UserSlice/UserSlice";
import { handleAsyncError } from "../../utils/handleAsyncError";

const VerifyOtp = ({
  phone = 0,
  otp,
  setOtpValue,
  setInputValue,
  modalChange,
  email = "",
  seconds,
  setSecondChanger,
  isTimerActive,
  setTimerActive,
}) => {
  const [otpInput, setOtpInput] = useState(new Array(6).fill(""));
  const [onOtpSubmit, setOnOtpSubmit] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef([]);
  const dispatch = useDispatch();

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otpInput];
    // allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtpInput(newOtp);
    //submit trigger
    const combinedOtp = newOtp.join("");
    // console.log(combinedOtp);
    // after all field are filled auto submit
    if (combinedOtp.length == 6) {
      setOnOtpSubmit(combinedOtp);
      handleLogin(null, combinedOtp);
    }

    // move to next input if current field is filled
    if (value && index < 6 - 1 && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus();
    }
  };

  // Handle pasting OTP into the inputs
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (paste.length === 6 && /^[0-9]+$/.test(paste)) {
      const newOtp = paste.split("");
      setOtpInput(newOtp);
      const combinedOtp = newOtp.join("");
      if (combinedOtp.length === 6) {
        // Submit OTP when all fields are filled
        setOnOtpSubmit(combinedOtp);
        handleLogin(null, combinedOtp);
      }
    }
  };

  const handleClick = (index) => {
    inputRef.current[index].setSelectionRange(1, 1);
  };
  //   move focus to previous input if current field is empty
  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otpInput[index] &&
      index > 0 &&
      inputRef.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRef.current[index - 1].focus();
    }
  };

  // autofill otp only for dev mode
  const handleOtpDev = () => {
    if (otp) {
      const pastedData = otp.toString().slice(0, 6);
      const newOtp = [...otpInput];
      for (let i = 0; i < 6 && i < 6; i++) {
        newOtp[i] = pastedData[i];
        if (inputRef.current[i]) {
          inputRef.current[i].focus();
        }
      }
      setOtpInput(newOtp);
      setOnOtpSubmit(otp);
    }
  };

  useEffect(() => {
    //move focus to the first input
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
    }
    // autofill otp only for dev mode
    // handleOtpDev();
  }, []);

  useEffect(() => {
    //setting interval between another otp request
    let interval = null;
    if (isTimerActive && seconds > 0) {
      interval = setInterval(() => {
        setSecondChanger((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, seconds]);

  const handleLogin = async (e, otp) => {
    setLoading(true);
    if (e) e.preventDefault();
    let response;
    if (phone != 0) {
      response = await handleUser("/verifyOtp", {
        otp: otp,
        contact: phone,
      });
    } else if (email != "") {
      response = await handleUser("/emailverify", {
        otp: otp,
        email: email,
      });
    }
    if (response?.status == 200) {
      handleAsyncError(dispatch, response?.message, "success");
      if (phone != 0) {
        dispatch(handleSignIn(response?.data));
      }
      setOtpValue && setOtpValue(false);
      setInputValue && setInputValue("");
      dispatch(modalChange());
    } else {
      handleAsyncError(dispatch, response?.message);
    }
    return setLoading(false);
  };

  // resending otp
  const handleSendOtpAgain = async () => {
    if (phone == 0) return;
    const response = await handleUser("/optGernet", { contact: phone });
    if (response?.status == 200) {
      setSecondChanger(0);
      setTimerActive(true);
    } else {
      handleAsyncError(dispatch, "unable to send otp! try again");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <>
        {console.log(seconds)}
        <p className="text-gray-400 lg:text-gray-600 text-center mb-4">
          Code sent to {email != "" ? email : `+91-(${phone})`}
        </p>
        <div
          className="flex items-center justify-around gap-2 lg:gap-4 mx-auto mt-2 mb-4"
          onPaste={handlePaste}
        >
          {otpInput.map((value, index) => (
            <input
              key={index}
              type="text"
              value={value}
              ref={(input) => (inputRef.current[index] = input)}
              onChange={(e) => handleChange(index, e)}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="rounded-lg border border-gray-300 cursor-text w-10 lg:w-14 aspect-square flex items-center justify-center focus:outline-theme-blue text-center"
              maxLength={1}
            />
          ))}
        </div>
        <div className="flex items-center flex-col justify-between mb-5">
          <p className="lg:text-gray-600 text-sm text-gray-400">
            Didn't receive code?
          </p>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-2 text-sm font-medium text-center rounded text-gray-500 hover:text-theme disabled:text-gray-400"
              disabled={isTimerActive}
              type="button"
              onClick={handleSendOtpAgain}
            >
              {seconds == 0
                ? "Request Again"
                : `Request Again (00:00:${seconds})`}
            </button>
          </div>
        </div>
        <button
          className="w-full px-4 py-2 text-lg font-medium text-white bg-theme rounded-md hover:bg-theme-dark transition duration-200 ease-in-out outline-none disabled:bg-gray-500"
          type="submit"
          disabled={loading || onOtpSubmit.length != 6}
        >
          {loading ? <Spinner message={"loading.."} /> : "Verify"}
        </button>
      </>
    </form>
  );
};

export default VerifyOtp;
