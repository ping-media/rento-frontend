import { Link } from "react-router-dom";
import { otherLink } from "../../Data/dummyData";

const Footer = () => {
  return (
    <footer className="bg-white crusor-default">
      <div className="w-[95%] lg:w-[90%] mx-auto py-3.5">
        <ul className="flex items-center justify-center flex-wrap gap-1.5 lg:gap-2.5 lg:mb-2.5">
          {otherLink?.map((item, index) => (
            <li
              key={index}
              className="hover:text-theme transition-all ease-in-out duration-300"
            >
              <Link to={`${item?.link}`}>{item?.name}</Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-center pt-1.5 lg:pt-0 mt-5 lg:mt-0 border-t-2 lg:border-t-0">
          <p className="order-2 lg:order-1 cursor-default">
            <span className="font-bold cursor-pointer">
              &copy; {new Date().getFullYear()} Rento Bikes.{" "}
            </span>
            All Right Reserved By{" "}
            <span className="text-semibold">
              Bongi Mobility Solutions Private Limited
            </span>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
