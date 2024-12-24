import scooterImage from "../assets/logo/scooter.png";
import bikeImage from "../assets/logo/bike.png";
import { getRoundedDateTime } from "../utils";

//for setting currentDatePlusOne and sending for explore
const currentDatePlusOne = new Date();
currentDatePlusOne.setDate(currentDatePlusOne.getDate() + 1);
const dateAndTime = getRoundedDateTime(new Date());
const nextDayAndTime = getRoundedDateTime(currentDatePlusOne);

// const items = [
//   {
//     productImage: "",
//     productTitle: "Yamaha Fascino 125CC",
//     price: "429",
//     pickupLocation: "agra cantt",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
//   {
//     productImage: "",
//     productTitle: "Honda Activa 5G",
//     price: "429",
//     pickupLocation: "sadar bazzar",
//   },
// ];

const menuList = [
  { title: "home", link: "/", isPhone: false },
  {
    title: "explore",
    link: `/explore?BookingStartDateAndTime=${dateAndTime}&BookingEndDateAndTime=${nextDayAndTime}`,
    isPhone: false,
  },
  { title: "Profile", link: "/profile", isPhone: true },
  { title: "My Rides", link: "/my-rides", isPhone: true },
  { title: "Logout", link: "", isPhone: true },
];

const Categories = [
  { categoryImage: scooterImage, CategoryTitle: "Non-Gear" },
  { categoryImage: bikeImage, CategoryTitle: "Gear" },
];

const brands = [
  "Vespa",
  "Honda",
  "Yamaha",
  "Suzuki",
  "KTM",
  "BMW",
  "TVS",
  "Bajaj",
  "Hero",
  "Ather",
  "Ola",
  "Mahindra",
  "Royal Enfield",
  "Harley-Davidson",
];
const Modal = ["Choose Modal", "Activa", "Jupiter", "Splender"];

const otherLink = [
  { name: "Terms & Conditions", link: "/terms-and-conditions" },
  { name: "Privacy Policy", link: "/privacy-policy" },
  { name: "Refund Policy", link: "/refund-return" },
  { name: "Contact Us", link: "/contact-us" },
];

const contactUsLink = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
        />
      </svg>
    ),
    name: "Registered Company",
    value: "Rento Bikes",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    ),
    name: "Registered Address",
    value: "HSR Layout, Bangalore, 560016",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    ),
    name: "Contact Number",
    value: "+919916864268",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
        />
      </svg>
    ),
    name: "Support Email",
    value: "support@rentobikes.com",
  },
];

export { Categories, brands, Modal, menuList, otherLink, contactUsLink };
