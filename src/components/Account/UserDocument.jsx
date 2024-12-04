import { useDispatch, useSelector } from "react-redux";
import {
  toggleIdentityModal,
  toggleLicenseModal,
} from "../../Redux/ModalSlice/ModalSlice";
import PreLoader from "../skeleton/PreLoader";
import { useEffect } from "react";
import {
  handleAddUserDocument,
  handleLoadingUserData,
  restLoading,
} from "../../Redux/UserSlice/UserSlice";
import { fetchingData } from "../../Data";
import { handleAsyncError } from "../../utils/handleAsyncError";

const UserDocument = () => {
  const dispatch = useDispatch();
  const { currentUser, userDocument, loading } = useSelector(
    (state) => state.user
  );

  // useEffect(() => {
  //   (async () => {
  //     dispatch(handleLoadingUserData());
  //     try {
  //       const response = await fetchingData(
  //         `/getDocument?userId=${currentUser && currentUser?._id}`
  //       );
  //       if (response?.status == 200) {
  //         dispatch(handleAddUserDocument(response?.data));
  //       } else {
  //         dispatch(restLoading());
  //         handleAsyncError(dispatch, response?.message);
  //       }
  //     } catch (error) {
  //       return handleAsyncError(dispatch, error?.message);
  //     }
  //   })();
  // }, []);

  return !loading ? (
    <div className="border-2 rounded-lg px-4 py-2 shadow-md bg-white">
      <div className="border-b-2 border-gray-400 mb-3 py-2 flex items-center flex-wrap gap-2 lg:gap-0 justify-between">
        <h2 className="font-bold text-xl uppercase w-full lg:w-auto">
          upload <span className="text-theme">documents</span>
        </h2>
        <div className="flex items-center gap-2">
          {/* {userDocument?.length > 0 && !userDocument[0]?.LicenseImage && ( */}
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
          {/* )} */}
          {/* {userDocument?.length > 0 && !userDocument[0]?.AadharImage && ( */}
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
          {/* )} */}
        </div>
      </div>
      <div className="px-4 py-2">
        {userDocument?.length > 0 ? (
          <></>
        ) : (
          // <div className="shadow-lg rounded-lg overflow-hidden mx-1">
          //   <table className="w-full table-fixed">
          //     <thead>
          //       <tr className="bg-gray-100">
          //         <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
          //           sno
          //         </th>
          //         <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
          //           Image Type
          //         </th>
          //         <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
          //           image
          //         </th>
          //         <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
          //           Status
          //         </th>
          //       </tr>
          //     </thead>
          //     <tbody className="bg-white">
          //       {userDocument[0]?.LicenseImage && (
          //         <tr>
          //           <td className="py-4 px-6 border-b border-gray-200">1.</td>
          //           <td className="py-4 px-6 border-b border-gray-200 truncate">
          //             License
          //           </td>
          //           <td className="py-4 px-6 border-b border-gray-200">
          //             <img
          //               src={userDocument[0]?.LicenseImage}
          //               className="w-20 h-20 object-contain"
          //               alt="License_image"
          //             />
          //           </td>
          //           <td className="py-4 px-6 border-b border-gray-200">
          //             <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
          //               pending
          //             </span>
          //           </td>
          //         </tr>
          //       )}
          //       {userDocument[0]?.AadharImage && (
          //         <tr>
          //           <td className="py-4 px-6 border-b border-gray-200">2.</td>
          //           <td className="py-4 px-6 border-b border-gray-200 truncate">
          //             Aadhar
          //           </td>
          //           <td className="py-4 px-6 border-b border-gray-200">
          //             <img
          //               src={userDocument[0]?.AadharImage}
          //               className="w-20 h-20 object-contain"
          //               alt="License_image"
          //             />
          //           </td>
          //           <td className="py-4 px-6 border-b border-gray-200">
          //             <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
          //               pending
          //             </span>
          //           </td>
          //         </tr>
          //       )}
          //     </tbody>
          //   </table>
          // </div>
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
