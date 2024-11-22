const InputFile = ({ labelDesc, labelId, name }) => {
  return (
    <>
      <div className="text-left mb-2 text-gray-500">
        <p>{labelDesc}</p>
      </div>
      <div className="relative border-2 border-dashed border-gray-300 rounded-md px-6 py-4 text-center">
        <input type="file" className="hidden" name={name} id={labelId} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21" />
          <path d="M16 16l-4-4-4 4" />
        </svg>
        <p className="text-sm text-gray-600">Drag & Drop your Image here</p>
        <p className="uppercase text-gray-600 mb-2">or</p>
        <label
          htmlFor={labelId}
          className="cursor-pointer hover:bg-theme-dark hover:shadow-md transition duration-200 ease-in-out border-2 px-2 py-1 border-theme rounded-md uppercase bg-theme text-gray-100 text-sm"
        >
          Choose Image
        </label>
      </div>
    </>
  );
};

export default InputFile;
