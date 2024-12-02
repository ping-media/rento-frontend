import { useDispatch, useSelector } from "react-redux";
import InputWithIconAndLabel from "../Input/InputWithIconAndLabel";
import InputWithLabel from "../Input/InputWithLabel";
import LicenseModal from "../Modals/LicenseModal";
import {
  toggleIdentityModal,
  toggleLicenseModal,
} from "../../Redux/ModalSlice/ModalSlice";
import IdentityModal from "../Modals/IdentityModal";
import SelectDropDown from "../DropdownButton/SelectDropDown";

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
  };
  return (
    <>
      {/* modals  */}
      <LicenseModal />
      <IdentityModal />
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
              } text-white px-1 lg:px-4 py-1 rounded-sm`}
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
                value={currentUser?.firstName}
              />
            </div>
            <div className="w-full lg:flex-1">
              <InputWithLabel
                name={"lastName"}
                placeholderDesc={"Enter Last Name"}
                labelDesc={"Last Name"}
                labelId={"last_name"}
                value={currentUser?.lastName}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className="flex-1 flex items-center flex-wrap lg:flex-nowrap gap-2">
              <InputWithLabel
                name={"dateOfBirth"}
                placeholderDesc={"Enter Date Of Birth"}
                labelDesc={"Date Of Birth"}
                labelId={"dob"}
                type="date"
              />
              <SelectDropDown
                name={"gender"}
                labelDesc={"Gender"}
                labelId={"gender"}
                value={currentUser?.gender}
              />
            </div>
            <div className="w-full lg:flex-1">
              <InputWithLabel
                name={"email"}
                placeholderDesc={"Enter Email Address"}
                labelDesc={"Email Address"}
                labelId={"email"}
                type="email"
                value={currentUser?.email}
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
                value={currentUser?.contact}
              />
            </div>
            <div className="w-full lg:flex-1">
              <InputWithIconAndLabel
                name={"altContact"}
                labelId={"altPhoneNumber"}
                labelDesc={"Alternative Contact Number"}
                placeholderDesc={"Enter Alternative Phone Number"}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-theme px-4 py-2 text-gray-100 rounded-lg hover:bg-theme-dark transition duration-200 ease-in-out disabled:bg-gray-400 w-full lg:w-auto"
            disabled
          >
            Update Profile
          </button>
        </form>
      </div>
      <div className="border-2 rounded-lg px-4 py-2 shadow-md bg-white">
        <div className="border-b-2 border-gray-400 mb-3 py-2 flex items-center flex-wrap gap-2 lg:gap-0 justify-between">
          <h2 className="font-bold text-xl uppercase w-full lg:w-auto">
            upload <span className="text-theme">documents</span>
          </h2>
          <div className="flex items-center gap-2">
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
          </div>
        </div>
        <div className="px-4 py-2">
          <p className="text-center font-semibold italic uppercase text-gray-400 text-sm">
            No document uploaded yet.
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
