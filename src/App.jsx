import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, useEffect, useState } from "react";
import Layout from "./components/Layout/Layout";
import GlobalErrorBoundary from "./context/GlobalErrorBoundary";
import Loadable from "./components/Loader/Loadable";
const Maintenance = lazy(() => import("./Pages/Maintenance"));
const PaymentSuccess = lazy(() => import("./Pages/PaymentSuccess"));
const Kyc = lazy(() => import("./Pages/Kyc"));
const Profile = lazy(() => import("./components/Account/Profile"));
const MyRides = lazy(() => import("./components/Account/MyRides"));
const RidesSummary = lazy(() => import("./Pages/RidesSummary"));
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const TermsAndCondition = lazy(() => import("./Pages/TermsAndCondition"));
const RefundAndReturn = lazy(() => import("./Pages/RefundAndReturn"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import BookingSummary from "./Pages/BookingSummary";
import NetworkError from "./components/Error/NetworkError";
import ErrorPageNotFound from "./components/Error/ErrorPageNotFound";
import Payment from "./Pages/Payment";
import LoggedInLayout from "./components/Layout/LoggedInLayout";

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

  useEffect(() => {
    let lastActiveTime = Date.now();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        const inactiveTime = now - lastActiveTime;
        const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
        // Only reload if inactive for more than 10 minutes
        if (inactiveTime > tenMinutes) {
          window.location.href = "/";
          // window.location.reload();
        }
        lastActiveTime = now;
      } else {
        // Update last active time when leaving tab
        lastActiveTime = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!isOnline) {
    return <NetworkError />;
  }

  return (
    <Router>
      <GlobalErrorBoundary>
        <Routes>
          {/* layout wrapper  */}
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/monthly-rental" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/:id" element={<Search />} />
            <Route path="/explore" element={<Search />} />
            <Route path="/booking/summary/:id" element={<BookingSummary />} />
            {/* <Route path="booking/payment/:id" element={<BookingAndPayment />} /> */}
            <Route path="/contact-us" element={Loadable(ContactUs)} />
            <Route path="/kyc" element={Loadable(Kyc)} />
            {/* protected routes start here  */}
            <Route path="/account/" element={<LoggedInLayout />}>
              <Route path="profile" element={Loadable(Profile)} />
              <Route path="my-rides" element={Loadable(MyRides)} />
              <Route
                path="my-rides/summary/:id"
                element={Loadable(RidesSummary)}
              />
            </Route>
            {/* protected routes end here  */}
            <Route path="privacy-policy" element={Loadable(PrivacyPolicy)} />
            <Route
              path="terms-and-conditions"
              element={Loadable(TermsAndCondition)}
            />
            <Route path="refund-return" element={Loadable(RefundAndReturn)} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/payment-success" element={Loadable(PaymentSuccess)} />
          </Route>
          <Route path="*" element={<ErrorPageNotFound />} />
          <Route path="/maintenance" element={Loadable(Maintenance)} />
        </Routes>
      </GlobalErrorBoundary>
    </Router>
  );
};

export default App;
