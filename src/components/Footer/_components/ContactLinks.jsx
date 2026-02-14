import React from "react";

const ContactLinks = React.memo(({ links }) => {
  return (
    <div>
      <h2 className="text-xl text-white font-bold mb-3">Contact Us</h2>
      <ul className="leading-10">
        {links.map((item, index) => (
          <li
            key={index}
            className="text-white hover:text-gray-300 transition-all ease-in-out duration-300"
          >
            {item?.link ? (
              <a href={item.link} className="flex items-center gap-2">
                <div className="text-theme">{item.icon}</div>
                {item?.value}
              </a>
            ) : (
              <span
                className={`flex items-center gap-2 cursor-pointer capitalize`}
              >
                <div className="text-theme">{item.icon}</div>
                {item?.value}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ContactLinks;
