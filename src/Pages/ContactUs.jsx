import ContactImg from "../assets/logo/contact.svg";
import { contactUsLink } from "../Data/dummyData";

const ContactUs = () => {
  return (
    <div className="w-[95%] lg:w-[90%] mx-auto py-2.5">
      <div className="flex flex-wrap my-3.5">
        <div className="flex-1 h-[36rem]">
          <img
            src={ContactImg}
            className="w-full h-full object-cover"
            alt="SUPPORT"
          />
        </div>
        <div className="flex-1">
          <div className="mb-5">
            <small className="text-theme text-sm font-semibold">
              Contact Us
            </small>
            <h1 className="text-4xl font-bold">
              Feel Free to <span className="text-theme">contact</span> us!
            </h1>
            <p className="text-sm text-gray-500 my-1">
              We’re here to help—feel free to reach out to us anytime!
            </p>
          </div>

          <div className="bg-white px-6 lg:px-4 py-3.5 rounded-lg shadow-md">
            <ul className="leading-10">
              {contactUsLink?.map((item, index) => (
                <li className="mb-4 cursor-pointer" key={index}>
                  <div className="flex items-center gap-2 text-theme text-lg">
                    <div>{item?.icon}</div>
                    <div className="">{item?.name}:</div>
                  </div>
                  <div className="text-lg text-gray-500">{item?.value}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
