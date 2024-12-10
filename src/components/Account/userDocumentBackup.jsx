const userDocumentBackup = () => {
  return (
    <>
      <div className="shadow-lg rounded-lg overflow-hidden mx-1">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                sno
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Image Type
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                image
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {userDocument[0]?.LicenseImage && (
              <tr>
                <td className="py-4 px-6 border-b border-gray-200">1.</td>
                <td className="py-4 px-6 border-b border-gray-200 truncate">
                  License
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <img
                    src={userDocument[0]?.LicenseImage}
                    className="w-20 h-20 object-contain"
                    alt="License_image"
                  />
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
                    pending
                  </span>
                </td>
              </tr>
            )}
            {userDocument[0]?.AadharImage && (
              <tr>
                <td className="py-4 px-6 border-b border-gray-200">2.</td>
                <td className="py-4 px-6 border-b border-gray-200 truncate">
                  Aadhar
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <img
                    src={userDocument[0]?.AadharImage}
                    className="w-20 h-20 object-contain"
                    alt="License_image"
                  />
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
                    pending
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default userDocumentBackup;
