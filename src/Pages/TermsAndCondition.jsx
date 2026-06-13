import usePolicy from "../hooks/usePolicy";
import Spinner from "../components/Spinner/Spinner";

const TermsAndCondition = ({ isModal = false }) => {
  const { loading, policy } = usePolicy("terms_and_conditions");

  if (loading) {
    return (
      <div
        className={`${
          isModal
            ? ""
            : "flex items-center justify-between w-[95%] lg:w-[90%] mx-auto py-2.5"
        }`}
      >
        <div
          className={`${
            isModal
              ? ""
              : "leading-7 max-w-4xl lg:max-w-7xl mx-auto bg-white px-6 py-4 rounded-lg shadow-md"
          }`}
        >
          <div className="w-full">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isModal
          ? ""
          : "flex items-center justify-between w-[95%] lg:w-[90%] mx-auto py-2.5"
      }`}
    >
      <div
        className={`${
          isModal
            ? ""
            : "leading-7 max-w-4xl lg:max-w-7xl mx-auto bg-white px-6 py-4 rounded-lg shadow-md"
        }`}
      >
        <div
          className="policy-content"
          dangerouslySetInnerHTML={{ __html: policy }}
        />
      </div>
    </div>
  );
};

export default TermsAndCondition;
