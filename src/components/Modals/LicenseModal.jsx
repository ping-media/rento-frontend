import { useDispatch, useSelector } from "react-redux";
import { toggleLicenseModal } from "../../Redux/ModalSlice/ModalSlice";
import Input from "../Input/Input";
import { useRef } from "react";
import InputFile from "../Input/InputFile";

const LicenseModal = () => {
  const dispatch = useDispatch();
  const { isLicenseModalActive } = useSelector((state) => state.modals);
  const licenseNumberRef = useRef(null);

  const pointsToRemember = [
    "Please upload clear images of both the front and back sides of the original driving license.",
    "Ensure that the license number, photo, and date of birth are clearly visible in the images.",
  ];

  const handleUploadLicense = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div
        className={`fixed ${
          !isLicenseModalActive && "hidden"
        } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
      >
        <div className="relative top-5 lg:top-20 mx-auto shadow-xl rounded bg-white max-w-2xl">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="font-bold text-2xl uppercase">
              upload <span className="text-theme">License</span>
            </h2>
            <button
              onClick={() => dispatch(toggleLicenseModal())}
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
            <form
              className="flex flex-wrap gap-4"
              onSubmit={handleUploadLicense}
            >
              <div className="w-full lg:flex-1 order-2 lg:order-1">
                <div className="mb-5">
                  <Input
                    name={"licenseNumber"}
                    placeholderDesc={"Enter Driving License Number"}
                    modalRef={licenseNumberRef}
                    type="text"
                  />
                </div>
                <div className="mb-5">
                  <Input
                    name={"expiryDate"}
                    placeholderDesc={"Enter Expiry Date"}
                    type="date"
                  />
                </div>
                <ul className="leading-10 px-4 text-gray-600 mb-5 list-decimal">
                  {pointsToRemember.map((item, index) => (
                    <li key={index} className="font-semibold text-sm text-left">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="text-left mb-5">
                  <button
                    className="bg-theme-black px-4 py-2 rounded-md text-gray-100 disabled:bg-gray-400"
                    disabled
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="w-full lg:flex-1 order-1 lg:order-2">
                <div className="mb-5">
                  <InputFile
                    name={"frontLicenseImage"}
                    labelDesc={"Front License Image"}
                    labelId={"licenseFrontImage"}
                  />
                </div>
                <div className="mb-5">
                  <InputFile
                    name={"backLicenseImage"}
                    labelDesc={"Back License Image"}
                    labelId={"licenseBackImage"}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LicenseModal;
