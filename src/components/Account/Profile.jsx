import { useDispatch, useSelector } from "react-redux";
import { lazy, useEffect, useState } from "react";
import InputWithIconAndLabel from "../Input/InputWithIconAndLabel";
import InputWithLabel from "../Input/InputWithLabel";
import SelectDropDown from "../DropdownButton/SelectDropDown";
import { handleAsyncError } from "../../utils/handleAsyncError.js";
import Spinner from "../Spinner/Spinner.jsx";
import UserDocument from "./UserDocument.jsx";
import PreLoader from "../skeleton/PreLoader.jsx";
import { fetchingData, handleupdateUser } from "../../Data/index.js";
import InputWithVerifyButton from "../Input/InputWithVerifyButton.jsx";
import {
  handleLoadingUserData,
  handleSignIn,
  handleUpdateSelectedCurrentUser,
} from "../../Redux/UserSlice/UserSlice.js";
import TextAreaBox from "../Input/TextAreaBox.jsx";
const SelfieModal = lazy(() => import("../Modals/SelfieModal.jsx"));
const IdentityModal = lazy(() => import("../Modals/IdentityModal"));
const LicenseModal = lazy(() => import("../Modals/LicenseModal"));
const EmailVerifyModal = lazy(() => import("../Modals/EmailVerifyModal"));

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { isEmailVerifyModalActive } = useSelector((state) => state.modals);
  const [isValidDOB, setIsValidDOB] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [inputError, setInputError] = useState("");

  // fetching updated user details
  useEffect(() => {
    if (
      currentUser &&
      isEmailVerifyModalActive === false &&
      formLoading == false
    ) {
      (async () => {
        dispatch(handleLoadingUserData());
        const result = await fetchingData(
          `/getAllUsers?_id=${currentUser && currentUser?._id}`
        );
        if (result?.status == 200) {
          return dispatch(handleSignIn(result?.data[0]));
        }
      })();
    }
  }, [isEmailVerifyModalActive]);

  // updating user profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const currentEmail = currentUser?.email;
    const response = new FormData(e.target);
    let result = Object.fromEntries(response.entries());
    let formEmail = result["email"];
    result = Object.assign(result, {
      _id: currentUser?._id,
      isEmailVerified:
        currentEmail === formEmail ? currentUser?.isEmailVerified : "no",
      isContactVerified: currentUser?.isContactVerified,
      kycApproved: currentUser?.kycApproved,
      userType: "customer",
    });
    if (!result)
      return handleAsyncError(dispatch, "unable to update! try again.");
    setFormLoading(true);
    try {
      const response = await handleupdateUser(result);
      if (response?.status == 200) {
        dispatch(handleUpdateSelectedCurrentUser(result));
        handleAsyncError(dispatch, response?.message, "success");
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      setFormLoading(false);
      return error?.message;
    } finally {
      setFormLoading(false);
    }
  };

  return currentUser ? (
    <>
      {/* modals  */}
      <LicenseModal />
      <IdentityModal />
      <SelfieModal />
      <EmailVerifyModal />
      <div className="border-2 rounded-lg px-4 py-2 shadow-md bg-white mb-3">
        <div className="border-b-2 border-gray-400 mb-3 py-2 flex items-center justify-between">
          <h2 className="font-bold text-lg lg:text-xl uppercase">
            User <span className="text-theme">Profile</span>
          </h2>
          <h2 className="text-xs lg:text-sm">
            <span className="font-semibold mr-1">KYC Status:</span>
            <span
              className={`${
                currentUser?.kycApproved == "yes"
                  ? "bg-green-500"
                  : "bg-red-500"
              } text-white px-1 lg:px-4 py-1 rounded-md`}
            >
              {currentUser?.kycApproved == "yes" ? "Verified" : "Not Verified"}
            </span>
          </h2>
        </div>
        <form onSubmit={handleProfileUpdate}>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className="w-full lg:flex-1">
              <InputWithLabel
                name={"firstName"}
                placeholderDesc={"Enter First Name"}
                labelDesc={"First Name"}
                labelId={"first_name"}
                value={currentUser?.firstName || ""}
                required={true}
              />
            </div>
            <div className="w-full lg:flex-1">
              <InputWithLabel
                name={"lastName"}
                placeholderDesc={"Enter Last Name"}
                labelDesc={"Last Name"}
                labelId={"last_name"}
                value={currentUser?.lastName || ""}
                required={true}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className="flex-1 flex items-center flex-wrap lg:flex-nowrap gap-2">
              <InputWithLabel
                name={"dateofbirth"}
                placeholderDesc={"Enter Date Of Birth"}
                labelDesc={"Date Of Birth"}
                value={currentUser?.dateofbirth || ""}
                labelId={"dob"}
                type="date"
                required={true}
                setDOBChanger={setIsValidDOB}
              />
              <SelectDropDown
                name={"gender"}
                labelDesc={"Gender"}
                labelId={"gender"}
                value={currentUser?.gender || ""}
                required={true}
                options={["male", "female", "others"]}
              />
            </div>
            <div className="w-full lg:flex-1">
              <InputWithVerifyButton
                name={"email"}
                placeholderDesc={"Enter Email Address"}
                labelDesc={"Email Address"}
                labelId={"email"}
                type="email"
                value={currentUser?.email || ""}
                status={currentUser?.isEmailVerified || ""}
                required={true}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className="w-full lg:flex-1">
              <InputWithIconAndLabel
                name={"contact"}
                labelId={"phoneNumer"}
                labelDesc={"Contact Number"}
                placeholderDesc={"Enter Phone Number"}
                value={currentUser?.contact || ""}
                required={true}
              />
            </div>
            <div className="w-full lg:flex-1">
              <InputWithIconAndLabel
                name={"altContact"}
                labelId={"altPhoneNumber"}
                labelDesc={"Alternative Contact Number"}
                placeholderDesc={"Enter Alternative Phone Number"}
                value={currentUser?.altContact || ""}
                checkValue={currentUser?.contact || ""}
                inputError={inputError}
                setInputError={setInputError}
                required={true}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className="w-full lg:flex-1">
              <TextAreaBox
                name={"addressProof"}
                placeholderDesc={"Enter Address"}
                labelDesc={"Enter Address"}
                labelId={"address"}
                value={currentUser?.addressProof || ""}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-theme px-4 py-2 text-gray-100 rounded-lg hover:bg-theme-dark transition duration-200 ease-in-out disabled:bg-gray-400 w-full lg:w-auto"
            disabled={formLoading || !isValidDOB || inputError !== ""}
          >
            {formLoading ? <Spinner message={"loading.."} /> : "Update Profile"}
          </button>
        </form>
      </div>
      {/* dcoument upload  */}
      <UserDocument />
    </>
  ) : (
    <PreLoader />
  );
};

export default Profile;
