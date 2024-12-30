import { Outlet, useParams } from "react-router-dom";
import { lazy, useEffect } from "react";
import TopHeader from "../Header/TopHeader";
import Header from "../Header/Header";
// lazy loading the below components
const LoginModal = lazy(() => import("../Modals/LoginModal"));
const RegisterModal = lazy(() => import("../Modals/RegisterModal"));
const LocationModal = lazy(() => import("../Modals/LocationModal"));
const SignOutModal = lazy(() => import("../Modals/SignOutModal"));
const Alert = lazy(() => import("../Alert/Alert"));
const Sidebar = lazy(() => import("../Sidebar/Sidebar"));
import { useDispatch, useSelector } from "react-redux";
import { handleCurrentUser } from "../../Redux/UserSlice/UserSlice";
import Footer from "../Footer/Footer";
import { handleRestCoupon } from "../../Redux/CouponSlice/CouponSlice";

const Layout = () => {
  const { message, type } = useSelector((state) => state.error);
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // setting decrypt user data
      dispatch(handleCurrentUser(user));
    }
  }, [user]);

  // this is to delete the temp booking & coupon data
  useEffect(() => {
    if (location.pathname == `/search/${id}` || location.pathname == "/") {
      dispatch(handleRestCoupon());
    }

    if (localStorage.getItem("tempBooking")) {
      localStorage.removeItem("tempBooking");
    }
  }, [location.href]);

  return (
    <>
      {/* login & register modals */}
      <LoginModal />
      <SignOutModal />
      <RegisterModal />
      <LocationModal />
      <Sidebar />
      {/* for displaying error or success message  */}
      {message != null && <Alert error={message} errorType={type} />}
      {/* main section  */}
      <header className="sticky top-0 z-20">
        <TopHeader
          email={"support@rentobikes.com"}
          phoneNumber={"+91 9916864268"}
        />
        <Header />
      </header>
      <main style={{ minHeight: "calc(100vh - 108.8px)" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
