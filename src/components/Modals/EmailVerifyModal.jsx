import { useDispatch, useSelector } from "react-redux";
import { toggleEmailVerifyModal } from "../../Redux/ModalSlice/ModalSlice";
import VerifyOtp from "../Auth/VerifyOtp";
import { useEffect, useState } from "react";
import { handlePostData } from "../../Data";
import { handleAsyncError } from "../../utils/handleAsyncError";
import PreLoader from "../skeleton/PreLoader";

const EmailVerifyModal = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const { isEmailVerifyModalActive } = useSelector((state) => state.modals);

  // sending the otp
  const handleSendOtp = async () => {
    setLoading(true);
    const response = await handlePostData("/emailOtp", {
      email: currentUser && currentUser?.email,
    });
    if (response?.status == 200) {
      handleAsyncError(dispatch, response?.message, "success");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser && isEmailVerifyModalActive === true) {
      handleSendOtp();
    }
  }, [currentUser, isEmailVerifyModalActive]);

  // closing the modal
  const handleCloseModal = () => {
    return dispatch(toggleEmailVerifyModal());
  };

  return !loading ? (
    <>
      <div
        className={`fixed ${
          !isEmailVerifyModalActive ? "hidden" : ""
        } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
      >
        <div className="relative top-5 lg:top-20 mx-auto shadow-xl rounded bg-white max-w-md">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="font-bold text-2xl uppercase">
              Verify <span className="text-theme">Email</span>
            </h2>
            <button
              onClick={handleCloseModal}
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

          <div className="p-4 pt-5 text-center">
            <VerifyOtp
              otp={123456}
              email={currentUser && currentUser?.email}
              modalChange={toggleEmailVerifyModal}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default EmailVerifyModal;
