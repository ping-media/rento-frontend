import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
import PreLoader from "./components/skeleton/PreLoader";
import Layout from "./components/Layout/Layout";
import UserDocument from "./components/Account/UserDocument";
const Payment = lazy(() => import("./Pages/Payment"));
const Home = lazy(() => import("./Pages/Home"));
const Search = lazy(() => import("./Pages/Search"));
const BookingSummary = lazy(() => import("./Pages/BookingSummary"));
const LoggedInLayout = lazy(() => import("./components/Layout/LoggedInLayout"));
const Profile = lazy(() => import("./components/Account/Profile"));
const MyRides = lazy(() => import("./components/Account/MyRides"));
const RidesSummary = lazy(() => import("./Pages/RidesSummary"));
const BookingAndPayment = lazy(() => import("./Pages/BookingAndPayment"));
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const TermsAndCondition = lazy(() => import("./Pages/TermsAndCondition"));
const RefundAndReturn = lazy(() => import("./Pages/RefundAndReturn"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));
const ErrorPageNotFound = lazy(() =>
  import("./components/Error/ErrorPageNotFound")
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" exact element={<Home />} />
            <Route path="/monthly-rental" exact element={<Home />} />
            <Route path="/search" exact element={<Search />} />
            <Route path="/search/:id" exact element={<Search />} />
            <Route path="/explore" exact element={<Search />} />
            <Route path="/contact-us" exact element={<ContactUs />} />
            <Route
              path="/booking/summary/:id"
              exact
              element={<BookingSummary />}
            />
            <Route
              path="booking/payment/:id"
              exact
              element={<BookingAndPayment />}
            />
            <Route path="/" element={<LoggedInLayout />}>
              <Route path="profile" exact element={<Profile />} />
              <Route path="my-rides" exact element={<MyRides />} />
              <Route path="kyc-verification" exact element={<UserDocument />} />
              <Route
                path="my-rides/summary/:id"
                exact
                element={<RidesSummary />}
              />
            </Route>
            <Route path="privacy-policy" exact element={<PrivacyPolicy />} />
            <Route
              path="terms-and-conditions"
              exact
              element={<TermsAndCondition />}
            />
            <Route path="refund-return" exact element={<RefundAndReturn />} />
            <Route path="/payment/:id" exact element={<Payment />} />
          </Route>
          <Route path="*" exact element={<ErrorPageNotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
