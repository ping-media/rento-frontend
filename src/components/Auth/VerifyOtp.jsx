import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { handleUser } from "../../Data";
import { handleSignIn } from "../../Redux/UserSlice/UserSlice";
import { handleAsyncError } from "../../utils/handleAsyncError";

const VerifyOtp = ({
  phone = 0,
  otp,
  setOtpValue,
  setInputValue,
  modalChange,
  email = "",
  setRestValue,
}) => {
  const [otpInput, setOtpInput] = useState(new Array(6).fill(""));
  const [onOtpSubmit, setOnOtpSubmit] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef([]);
  const dispatch = useDispatch();
  const [otpState, setOtpState] = useState({
    seconds: 30,
    isTimerActive: true,
  });

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otpInput];
    newOtp[index] = value.substring(value.length - 1);
    setOtpInput(newOtp);
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length == 6) {
      setOnOtpSubmit(combinedOtp);
      handleLogin(null, combinedOtp);
    }
    if (value && index < 6 - 1 && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus();
    }
  };

  // Handle pasting OTP into the inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();

    if (paste.length === 6 && /^[0-9]{6}$/.test(paste)) {
      const newOtp = paste.split("");
      setOtpInput(newOtp);

      const combinedOtp = newOtp.join("");
      setOnOtpSubmit(combinedOtp);
      handleLogin(null, combinedOtp);
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
      inputRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    //move focus to the first input
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
    }
  }, []);

  // Timer for Resending OTP
  useEffect(() => {
    try {
      let interval = null;
      if (otpState.isTimerActive && otpState.seconds > 0) {
        interval = setInterval(() => {
          setOtpState((prev) => ({ ...prev, seconds: prev.seconds - 1 }));
        }, 1000);
      } else {
        setOtpState((prev) => ({ ...prev, isTimerActive: false }));
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    } finally {
      setFirstLoad(false);
    }
  }, [otpState.isTimerActive, otpState.seconds]);

  // handle login
  const handleLogin = async (e, otp) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);
    let response;
    try {
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
    } catch (error) {
      handleAsyncError(dispatch, "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  // resending otp
  const handleSendOtpAgain = async () => {
    try {
      let response;
      if (phone != 0) {
        response = await handleUser("/otpGenerat", { contact: phone });
      } else if (email != "") {
        response = await handleUser("/emailOtp", { email: email });
      }

      if (response?.status == 200) {
        setOtpState({ seconds: 30, isTimerActive: true });
        handleAsyncError(dispatch, "OTP resent successfully.", "success");
      } else {
        handleAsyncError(dispatch, "Unable to send OTP! Try again");
      }
    } catch (error) {
      handleAsyncError(dispatch, "Error sending OTP");
    }
  };

  // resetting the input so that can revert back to input
  const handleRestOtpScreen = () => {
    setOtpValue(false);
    setRestValue && setRestValue("");
  };

  return (
    <form onSubmit={(e) => handleLogin(e, onOtpSubmit)}>
      <div className="flex items-center justify-center gap-1 mb-4">
        <p className="text-gray-400 lg:text-gray-600 text-center">
          Code sent to {email != "" ? email : `+91-(${phone})`}
        </p>
        {/* back to number page  */}
        {setRestValue && (
          <button
            className="text-sm font-medium text-center rounded text-gray-500 text-theme hover:text-gray-500 disabled:text-gray-400"
            type="button"
            onClick={handleRestOtpScreen}
          >
            Edit
          </button>
        )}
      </div>
      <div
        className="flex items-center justify-around gap-2 mx-auto mt-2 mb-4"
        onPaste={handlePaste}
      >
        {otpInput.map((value, index) => (
          <input
            key={index}
            type="number"
            value={value}
            ref={(input) => (inputRef.current[index] = input)}
            onChange={(e) => handleChange(index, e)}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="rounded-lg border border-gray-300 cursor-text w-10 lg:w-14 aspect-square flex items-center justify-center focus:outline-theme-blue text-center outline-none"
            maxLength={1}
          />
        ))}
      </div>

      <div className="flex items-center flex-col justify-between mb-1">
        <p className="lg:text-gray-600 text-sm text-gray-400">
          Didn't receive code?
        </p>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-2 text-sm font-medium text-center rounded hover:text-gray-500 text-theme disabled:text-gray-400"
            disabled={otpState.isTimerActive}
            type="button"
            onClick={handleSendOtpAgain}
          >
            {otpState.seconds === 0
              ? "Request Again"
              : `Request Again (00:00:${
                  otpState.seconds < 10
                    ? `0${otpState.seconds}`
                    : otpState.seconds
                })`}
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
    </form>
  );
};

export default VerifyOtp;
