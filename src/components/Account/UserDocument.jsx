import { useDispatch, useSelector } from "react-redux";
import {
  toggleIdentityModal,
  toggleLicenseModal,
  toggleSelfieModal,
} from "../../Redux/ModalSlice/ModalSlice";
import PreLoader from "../skeleton/PreLoader";
import { useEffect } from "react";
import {
  handleAddUserDocument,
  handleLoadingUserData,
  restLoading,
} from "../../Redux/UserSlice/UserSlice";
import { handleAsyncError } from "../../utils/handleAsyncError";
import { getUserDocuments } from "../../Data/Functions";

const UserDocument = ({ pageTitle = "upload documents" }) => {
  const dispatch = useDispatch();
  const { currentUser, userDocument, loading } = useSelector(
    (state) => state.user
  );
  const { isLicenseModalActive, isIdentityModalActive, isSelfieModalActive } =
    useSelector((state) => state.modals);

  // fetching user document & fetching updated documents
  useEffect(() => {
    if (
      isIdentityModalActive === false &&
      isLicenseModalActive === false &&
      isSelfieModalActive === false
    ) {
      getUserDocuments(
        handleLoadingUserData,
        currentUser,
        handleAddUserDocument,
        restLoading,
        dispatch,
        handleAsyncError
      );
    }
  }, [isLicenseModalActive, isIdentityModalActive, isSelfieModalActive]);

  return !loading ? (
    <div className="border-2 rounded-lg px-4 py-2 shadow-md bg-white">
      <div className="border-b-2 border-gray-400 mb-3 py-2 flex items-center flex-wrap gap-2 lg:gap-0 justify-between">
        <h2 className="font-bold text-xl uppercase w-full lg:w-auto">
          {pageTitle?.split(" ")[0]}{" "}
          <span className="text-theme">{pageTitle?.split(" ")[1]}</span>
        </h2>
        <div className="flex items-center gap-2">
          {(userDocument == null ||
            !userDocument[0]?.files.some((file) =>
              file.fileName.includes("Selfie")
            )) && (
            <button
              className="bg-theme-dark px-4 py-2 rounded-lg text-gray-100 flex items-center hover:bg-theme-dark transition duration-200 ease-in-out"
              onClick={() => dispatch(toggleSelfieModal())}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3" />
              </svg>
              <span className="ml-1">Selfie</span>
            </button>
          )}
          {(userDocument == null ||
            !userDocument[0]?.files.some((file) =>
              file.fileName.includes("license")
            )) && (
            <button
              className="bg-theme px-4 py-2 rounded-lg text-gray-100 flex items-center hover:bg-theme-dark transition duration-200 ease-in-out"
              onClick={() => dispatch(toggleLicenseModal())}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3" />
              </svg>
              <span className="ml-1">License</span>
            </button>
          )}
          {(userDocument == null ||
            !userDocument[0]?.files.some((file) =>
              file.fileName.includes("aadhar")
            )) && (
            <button
              className="bg-theme-black px-4 py-2 rounded-lg text-gray-100 flex items-center hover:bg-theme transition duration-200 ease-in-out"
              onClick={() => dispatch(toggleIdentityModal())}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3" />
              </svg>
              <span className="ml-1">Aadhaar</span>
            </button>
          )}
        </div>
      </div>
      <div className="px-4 py-2 mx-auto">
        {userDocument?.length > 0 ? (
          <div className="flex flex-wrap items-center gap-4">
            {userDocument[0]?.files?.map((file) => (
              <div
                className="block border-2 px-3 py-1 rounded-lg"
                key={file?._id}
              >
                <p className="mb-2 capitalize">
                  {file?.fileName?.includes("aadhar")
                    ? "Aadhaar"
                    : file?.fileName?.includes("license")
                    ? "Driving License"
                    : file?.fileName?.includes("selfie") && "Selfie"}{" "}
                  Image
                </p>
                <div className="w-60 h-40">
                  <img
                    src={file?.imageUrl}
                    className="w-full h-full object-cover"
                    alt={file?.fileName}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center font-semibold italic uppercase text-gray-400 text-sm">
            No document uploaded yet.
          </p>
        )}
      </div>
    </div>
  ) : (
    <PreLoader />
  );
};

export default UserDocument;
