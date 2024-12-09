import { useDispatch, useSelector } from "react-redux";
import { toggleIdentityModal } from "../../Redux/ModalSlice/ModalSlice";
import InputFile from "../Input/InputFile";
import { handleuploadDocument } from "../../Data";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";
import { handleAsyncError } from "../../utils/handleAsyncError";

const IdentityModal = () => {
  const dispatch = useDispatch();
  const { isIdentityModalActive } = useSelector((state) => state.modals);
  const { currentUser } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleUploadIdentity = async (e) => {
    setFormLoading(true);
    e.preventDefault();
    const response = new FormData(e.target);
    let result = Object.fromEntries(response.entries());
    if (!result) return handleAsyncError(dispatch, "choose vaild image first!");
    result = Object.assign(result, {
      userId: currentUser?._id,
      docType: "aadhar",
    });

    try {
      const response = await handleuploadDocument(result);
      if (response?.status == 200) {
        handleAsyncError(dispatch, response?.message, "success");
        setImage(null);
        dispatch(toggleIdentityModal());
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
          !isIdentityModalActive && "hidden"
        } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
      >
        <div className="relative top-5 lg:top-20 mx-auto shadow-xl rounded bg-white max-w-2xl">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="font-bold text-2xl uppercase">
              upload <span className="text-theme">Aadhaar</span>
            </h2>
            <button
              onClick={() => dispatch(toggleIdentityModal())}
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
              onSubmit={handleUploadIdentity}
            >
              <div className="w-full lg:flex-1 order-1 lg:order-2">
                <div className="mb-5">
                  <InputFile
                    name={"images"}
                    labelDesc={"Aadhaar Image"}
                    labelId={"aadhaarImage"}
                    image={image}
                    setImage={setImage}
                  />
                </div>
                <button
                  className="bg-theme-black px-4 py-2 rounded-md text-gray-100 disabled:bg-gray-400"
                  disabled={formLoading || image != null ? false : true}
                >
                  {formLoading ? (
                    <Spinner message={"loading.."} />
                  ) : (
                    "Upload Aadhaar"
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

export default IdentityModal;
