import { useDispatch, useSelector } from "react-redux";
import { toggleLicenseModal } from "../../Redux/ModalSlice/ModalSlice";
import InputFile from "../Input/InputFile";
import { handleAsyncError } from "../../utils/handleAsyncError";
import { handleuploadDocument } from "../../Data";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";

const LicenseModal = () => {
  const dispatch = useDispatch();
  const { isLicenseModalActive } = useSelector((state) => state.modals);
  const { currentUser } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const handleUploadLicense = async (e) => {
    setFormLoading(true);
    e.preventDefault();
    let formData = new FormData(e.target);
    let result = Object.fromEntries(formData.entries());
    if (!result) return handleAsyncError(dispatch, "choose vaild image first!");
    // appending other details before sending it s
    formData.append("userId", currentUser?._id);
    formData.append("docType", "license");

    try {
      const response = await handleuploadDocument(formData);
      if (response?.status == 200) {
        handleAsyncError(dispatch, response?.message, "success");
        setFrontImage(null);
        setBackImage(null);
        dispatch(toggleLicenseModal());
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    }
    return setFormLoading(false);
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
              <div className="w-full lg:flex-1 order-1 lg:order-2">
                <div className="flex items-center gap-2">
                  <div className="mb-5 flex-1">
                    <InputFile
                      name={"images"}
                      labelDesc={"Front License Image"}
                      labelId={"licenseFrontImage"}
                      image={frontImage}
                      setImage={setFrontImage}
                    />
                  </div>
                  <div className="mb-5 flex-1">
                    <InputFile
                      name={"images"}
                      labelDesc={"Back License Image"}
                      labelId={"licenseBackImage"}
                      image={backImage}
                      setImage={setBackImage}
                    />
                  </div>
                </div>
                <button
                  className="bg-theme-black px-4 py-2 rounded-md text-gray-100 disabled:bg-gray-400"
                  disabled={
                    formLoading ||
                    (frontImage && backImage != null ? false : true)
                  }
                >
                  {formLoading ? (
                    <Spinner message={"loading..."} />
                  ) : (
                    "Upload Driving License"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LicenseModal;
