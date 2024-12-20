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

export { Categories, brands, Modal, menuList };
