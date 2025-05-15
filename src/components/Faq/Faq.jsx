import { faqList } from "../../Data/dummyData";
import ArrowDown from "../../assets/icons/arrow-down.png";

const Faq = () => {
  return (
    <div className="w-full pt-8 pb-5 mt-5">
      <h2 className="text-xl lg:text-3xl mb-5 text-center font-bold">
        Frequently Asked Questions
      </h2>
      <div className="w-full lg:w-3/5 px-4 lg:px-0 lg:mx-auto">
        {faqList.map((item, indx) => (
          <details
            key={indx}
            className="bg-white p-4 rounded-xl mb-5 group shadow"
          >
            <summary className="cursor-pointer w-full list-none flex items-center justify-between">
              {item.question}
              <div className="size-4 transition-transform duration-300 ease-in-out group-open:rotate-180">
                <img
                  src={ArrowDown}
                  className="w-full h-full object-cover"
                  alt="ARROW"
                />
              </div>
            </summary>
            <div className="mt-2 group-open:border-t border-gray-200 group-open:pt-2">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Faq;
