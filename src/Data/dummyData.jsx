import scooterImage from "../assets/logo/scooter.png";
import bikeImage from "../assets/logo/bike.png";
import facebook from "../assets/icons/facebook.png";
import instagram from "../assets/icons/instagram.png";

export const isHomeLink = ["/", "/monthly-rental"];

export const menuList = [
  { title: "home", link: "/", isPhone: false },
  {
    title: "Monthly Rental",
    link: `/monthly-rental`,
    isPhone: false,
  },
  // {
  //   title: "explore",
  //   link: `/explore?BookingStartDateAndTime=${dateAndTime}&BookingEndDateAndTime=${nextDayAndTime}`,
  //   isPhone: false,
  // },
  { title: "Profile", link: "/account/profile", isPhone: true },
  { title: "My Rides", link: "/account/my-rides", isPhone: true },
  { title: "Logout", link: "", isPhone: true },
];

export const Categories = [
  { categoryImage: scooterImage, CategoryTitle: "Non-Gear" },
  { categoryImage: bikeImage, CategoryTitle: "Gear" },
];

export const brands = [
  "vespa",
  "honda",
  "yamaha",
  "suzuki",
  "KTM",
  "BMW",
  "TVS",
  "bajaj",
  "hero",
  "ather",
  "ola",
  "royal enfield",
  "harley davidson",
];
export const Modal = ["Choose Modal", "Activa", "Jupiter", "Splender"];

export const socialIcons = [
  { icon: facebook, link: "https://www.facebook.com/", label: "facebook" },
  { icon: instagram, link: "https://www.instagram.com/", label: "instagram" },
];

export const quickLink = [
  { name: "Terms & Conditions", link: "/terms-and-conditions" },
  { name: "Privacy Policy", link: "/privacy-policy" },
  { name: "Refund Policy", link: "/refund-return" },
  { name: "Contact Us", link: "/contact-us" },
];

export const contactUsFooterLink = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
    name: "Contact Number",
    value: "+91 8884488891",
    link: "tel:+918884488891",
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
    link: "mailto:support@rentobikes.com",
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
];

export const contactUsLink = [
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
        className="size-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
    name: "Contact Number",
    value: "+918884488891",
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

export const faqList = [
  {
    question: "HOW DO I PAY?",
    answer:
      "You can pay online using debit/credit cards or cash free payment using razorpay. Cash medium is also is acceptable in the outlets for bike rental as well as for other services.",
  },
  {
    question: "IS FUEL INCLUDED IN TARIFF?",
    answer:
      "No, fuel is not included in the amount you pay for two wheeler rental.",
  },
  {
    question: "CAN I RESCHEDULE MY BOOKING?",
    answer:
      "There is no rescheduling of an existing reservation as bikes have already been booked and kept reserved for you by us. You may cancel your current booking and then book a bike with a later date, however a cancellation fee will apply.",
  },
  {
    question: "CAN I EXTEND MY TRIP AFTER IT ENDS?",
    answer:
      "Extension of trips is always good news for us! However, if you need to extend your bike trip, it must be done before you end your trip and not after as we do not allow extension once you have ended your trip.",
  },
  {
    question: "IS THERE ANY KILOMETER CAPPING?",
    answer:
      "Yes, you are allowed to drive a certain distance, with charges applied per kilometre depending on the station. The per-kilometre charge will vary based on the station and the applicable rates for each location.",
  },
  {
    question: "WHAT DOCUMENTS ARE REQUIRED TO BOOK A BIKE?",
    answer:
      "For us to verify your documents in their original form, you essentially need two documents. Driver's Licence, Aadhaar Card, Election Card, Passport (anyone of these is acceptable).",
  },
];

// export const bookingTermsList = [
//   "Confirm that you are above 18 years of age and you agree to all Terms & Conditions",
//   "The original Driving license needs to be submitted at the time of pickup and the same will be returned at the time of dropping the vehicle.",
// ];

export const testimonials = [
  {
    id: 1,
    name: "Ravi Sharma",
    text: "I rented a scooter for a weekend trip and was genuinely impressed by the quality of service. The vehicle was clean, well-maintained, and ready on time. It made exploring the city so much more enjoyable!",
  },
  {
    id: 2,
    name: "Anjali Mehta",
    text: "This was my first time renting a two-wheeler online, and it couldn’t have been easier. The pickup process was quick, and the scooter ran perfectly. I'll definitely be using this service again for my short getaways.",
  },
  {
    id: 3,
    name: "Amit Verma",
    text: "A very convenient option for daily commuting. The rental process was simple, pricing was fair, and the scooter handled really well in traffic. Much better than depending on public transport!",
  },
  {
    id: 4,
    name: "Priya Desai",
    text: "I was a bit skeptical at first, but the entire experience was flawless. The bike was delivered on time, in great condition, and customer support even helped me change my return time without any hassle.",
  },
  {
    id: 5,
    name: "Karthik Reddy",
    text: "Fantastic service! I needed a bike for a last-minute errand, and the booking process was lightning fast. The bike had great mileage and was smooth to ride throughout the day.",
  },
  {
    id: 6,
    name: "Neha Joshi",
    text: "What I loved the most was how easy everything was—from selecting a vehicle to making the payment. Plus, the condition of the scooter exceeded my expectations. Totally worth it!",
  },
  {
    id: 7,
    name: "Manoj Kumar",
    text: "I used this service while visiting family in the city, and it made my travel so convenient. The pricing was transparent, and the whole experience felt professional and reliable.",
  },
  {
    id: 8,
    name: "Sneha Kapoor",
    text: "As someone who travels often, I've tried multiple rental services—and this one really stands out. The vehicle was in great shape, and I appreciated the polite behavior of the staff.",
  },
  {
    id: 9,
    name: "Rohit Patil",
    text: "Renting a bike through this platform saved me both time and money. I didn’t face a single issue with the vehicle during my 3-day trip. Highly recommend it for travelers and locals alike!",
  },
  {
    id: 10,
    name: "Divya Nair",
    text: "I was genuinely impressed by how organized everything was. The app was user-friendly, the vehicle pickup was seamless, and the return was just as easy. Great experience overall!",
  },
];
