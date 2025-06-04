import { useDispatch, useSelector } from "react-redux";
import { toggleCouponModal } from "../../Redux/ModalSlice/ModalSlice.js";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const SuccessModal = () => {
  const dispatch = useDispatch();
  const { isCouponModalActive } = useSelector((state) => state.modals);
  const { tempCouponName, tempCouponDiscount } = useSelector(
    (state) => state.coupon
  );
  const hasFiredConfetti = useRef(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isCouponModalActive && !hasFiredConfetti.current && modalRef.current) {
      hasFiredConfetti.current = true;

      const rect = modalRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Left side of card
      const leftX = rect.left / viewportWidth;
      const midY = (rect.top + rect.height / 2) / viewportHeight;

      // Right side of card
      const rightX = rect.right / viewportWidth;

      const options = {
        particleCount: 40,
        spread: 60,
        startVelocity: 20,
        ticks: 250,
        gravity: 0.4,
        scalar: 0.75,
      };

      confetti({ ...options, origin: { x: leftX, y: midY }, angle: 60 });
      confetti({ ...options, origin: { x: rightX, y: midY }, angle: 120 });
    }

    if (!isCouponModalActive) {
      hasFiredConfetti.current = false;
    }
  }, [isCouponModalActive]);

  return (
    <div
      className={`fixed ${
        !isCouponModalActive ? "hidden" : ""
      } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
    >
      <div
        ref={modalRef}
        className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-sm"
      >
        <div className="flex justify-end p-2">
          <button
            onClick={() => dispatch(toggleCouponModal())}
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

        <div className="p-3 pt-0 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-24 lg:w-28 h-24 lg:h-28 -mt-12 text-green-600 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>

          <p className="text-xs text-gray-400/90 mt-3">
            '{tempCouponName}' applied
          </p>
          <h3 className="text-md lg:text-xl font-bold mb-3">
            ₹{tempCouponDiscount} savings with this coupon
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
