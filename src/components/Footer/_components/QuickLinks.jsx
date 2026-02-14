import { memo } from "react";
import { quickLink } from "../../../Data/dummyData";
import { Link } from "react-router-dom";

const QuickLinks = memo(() => {
  return (
    <div>
      <h2 className="text-xl text-white font-bold mb-3">Quick Links</h2>
      <ul className="leading-10">
        {quickLink?.map((item, index) => (
          <li
            key={index}
            className="text-white hover:text-gray-300 hover:ml-2 transition-all ease-in-out duration-300"
          >
            <Link to={`${item?.link}`}>{item?.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default QuickLinks;
