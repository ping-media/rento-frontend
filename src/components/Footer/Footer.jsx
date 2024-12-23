import { Link } from "react-router-dom";
import { otherLink } from "../../Data/dummyData";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="flex items-center flex-wrap justify-between w-[95%] lg:w-[90%] mx-auto py-3.5">
        <p className="order-2 lg:order-1">
          <span className="font-bold">
            &copy; {new Date().getFullYear()} Rento.{" "}
          </span>
          All Right Reserved By{" "}
          <span className="text-semibold">
            Bongi Mobility Solutions Private Limited
          </span>
          .
        </p>

        <ul className="flex items-center gap-2.5 lg:order-2 order-1">
          {otherLink?.map((item, index) => (
            <li
              key={index}
              className="hover:text-theme transition-all ease-in-out duration-300"
            >
              <Link to={`${item?.link}`}>{item?.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
