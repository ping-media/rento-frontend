import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import PreLoader from "./components/skeleton/PreLoader";
import Layout from "./components/Layout/Layout";
const NetworkError = lazy(() => import("./components/Error/NetworkError"));
const Maintenance = lazy(() => import("./Pages/Maintenance"));
const PaymentSuccess = lazy(() => import("./Pages/PaymentSuccess"));
const Payment = lazy(() => import("./Pages/Payment"));
const Home = lazy(() => import("./Pages/Home"));
const Kyc = lazy(() => import("./Pages/Kyc"));
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <NetworkError />;
  }

  return (
    <Router>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          {/* layout wrapper  */}
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/monthly-rental" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/:id" element={<Search />} />
            <Route path="/explore" element={<Search />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/booking/summary/:id" element={<BookingSummary />} />
            <Route path="booking/payment/:id" element={<BookingAndPayment />} />
            <Route path="/kyc" element={<Kyc />} />
            {/* protected routes start here  */}
            <Route path="/account/" element={<LoggedInLayout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="my-rides" element={<MyRides />} />
              <Route path="my-rides/summary/:id" element={<RidesSummary />} />
            </Route>
            {/* protected routes end here  */}
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="terms-and-conditions"
              element={<TermsAndCondition />}
            />
            <Route path="refund-return" element={<RefundAndReturn />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Route>
          <Route path="*" element={<ErrorPageNotFound />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
