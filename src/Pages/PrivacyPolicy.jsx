import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="flex items-center justify-between w-[95%] lg:w-[90%] mx-auto py-2.5">
      <div className="leading-7 bg-white px-6 py-4 rounded-xl max-w-4xl lg:max-w-7xl mx-auto">
        <h1 className="text-xl lg:text-3xl font-bold mb-6">
          Privacy Policy for Rento Bikes
        </h1>

        <p className="text-gray-700 mb-4">
          Rento Bikes ("us", "we", or "our") operates the rentobikes.com website
          and the Rento Bikes mobile application (the "Service").
        </p>

        <p className="text-gray-700 mb-4">
          Rento Bikes is a company duly registered and incorporated under the
          Companies Act, 2008.
        </p>

        <p className="text-gray-700 mb-4">
          Rento Bikes owns and operates{" "}
          <Link to="https://rentobikes.com" className="text-theme">
            https://rentobikes.com
          </Link>
          , a platform for booking two-wheelers on rent/lease for both
          short-term and long-term durations.
        </p>

        <p className="text-gray-700 mb-4">
          This document is published and shall be construed in accordance with
          the provisions of the Information Technology (Reasonable Security
          Practices and Procedures and Sensitive Personal Data of Information)
          Rules, 2011 under the Information Technology Act, 2000, which mandates
          the publication of this Privacy Policy for the collection, use,
          storage, and transfer of sensitive personal data or information.
        </p>

        <p className="text-gray-700 mb-4">
          Please read this Privacy Policy carefully. By using the Website, you
          indicate that you understand, agree, and consent to this Privacy
          Policy. If you do not agree with the terms of this Privacy Policy,
          please refrain from using this Website.
        </p>

        <p className="text-gray-700 mb-4">
          By providing us your Information or by utilizing the facilities
          provided by the Website, you consent to the collection, storage,
          processing, and transfer of your Personal Information and Non-Personal
          Information as specified under this Privacy Policy. You further agree
          that such collection, use, storage, and transfer of your Information
          shall not cause any loss or wrongful gain to you or any other
          individual.
        </p>

        <h2 className="font-semibold text-lg text-gray-900 mb-4">
          Terms and Conditions
        </h2>

        <p className="text-gray-700 mb-4">
          By registering at Rento Bikes, you agree to the following terms and
          conditions:
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Platform Use:</span>
          Rento Bikes operates{" "}
          <Link to="https://rentobikes.com" className="text-theme">
            https://rentobikes.com
          </Link>
          , a platform for renting two-wheelers. Customers must sign up or log
          in by providing details such as full name, mobile number, email ID,
          password, emergency contact details (with the relationship), and blood
          type.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Agreement to Policies:</span>
          By registering on Rento Bikes, you accept all Terms and Conditions and
          the Privacy Policy and take full responsibility for all activities
          conducted under your name.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Account Security:</span>
          We recommend keeping your personal data secure and suggest you avoid
          sharing it with others. Impersonating someone else, creating fake
          accounts, or maintaining multiple accounts is strictly prohibited.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Information Collection and Use:</span>
          We collect various types of information to provide and improve our
          Service.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Types of Data Collected:</span>
          <br />
          <span className="font-semibold">Personal Data:</span>
          While using our Service, we may ask you to provide personally
          identifiable information, including but not limited to:
        </p>

        <p className="text-gray-700 mb-4">
          - Email address
          <br />
          - First and last name
          <br />
          - Phone number
          <br />
          - Employer
          <br />
          - College Name
          <br />
          - Address (including State, Province, ZIP/Postal code, City)
          <br />
          - Cookies and Usage Data
          <br />- Financial Information (such as bank account or credit card
          numbers) are collected where necessary to bill for services.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Other Information:</span>
          Additional details like age, occupation, PIN code, biometric data, and
          medical history may be collected for service-related purposes.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Cookies:</span>
          To enhance user experience, we use cookies to personalize the Website.
          Cookies assign a unique User ID to help understand user preferences
          without identifying individuals personally.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Information Sharing:</span>
          Rento Bikes does not sell, trade, or rent Personally Identifiable
          Information. We may share sensitive personal information under the
          following circumstances:
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Legal Requirements:</span>
          When required by law or government authority.
          <br />
          <span className="font-semibold">Internal Use:</span> With group
          companies or authorized employees for processing data under this
          Privacy Policy.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Security Measures:</span>
          Rento Bikes employs physical, electronic, and managerial procedures to
          safeguard the information collected. Although we take reasonable
          measures, the Internet is not entirely secure, and we cannot guarantee
          complete data security during transmission.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Governing Law:</span>
          These terms and conditions and the use of the Website shall be
          governed by Indian law. Any disputes arising shall fall under the
          exclusive jurisdiction of Indian courts.
        </p>

        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Changes to the Policy:</span>
          As the Internet evolves, this Privacy Policy may be updated. However,
          the use of information collected will remain consistent with the
          policy under which it was collected.
        </p>

        <p className="text-gray-700 mb-4">
          For queries, reach out to us at{" "}
          <span className="font-bold">support@rentobikes.com</span>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
