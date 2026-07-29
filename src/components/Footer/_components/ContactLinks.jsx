import React from "react";

const ContactLinks = React.memo(({ links }) => {
  return (
    <div>
      <h2 className="text-xl text-white font-bold mb-3">Contact Us</h2>
      <ul className="leading-10">
        {links.map((item, index) => (
          <li
            key={index}
            className="text-white transition-all ease-in-out duration-300"
          >
            {item?.link ? (
              <div className="flex items-center gap-1">
                <div className="text-theme">{item.icon}</div>
                {Array.isArray(item.value) ? (
                  <>
                    {item.value?.map((i, idx) => (
                      <a
                        href={`tel:+91 ${i}`}
                        key={i}
                        className="hover:text-gray-300"
                      >
                        {i}
                        {item.value?.length - 1 > idx ? "," : ""}
                      </a>
                    ))}
                  </>
                ) : (
                  <a href={item.link} className="hover:text-gray-300">
                    {item?.value}
                  </a>
                )}
              </div>
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
