import { Outlet, useLocation, useParams } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
import TopHeader from "../Header/TopHeader";
import Header from "../Header/Header";
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
import { toggleLocationModal } from "../../Redux/ModalSlice/ModalSlice";
import CallToActionButton from "../CallToAction/CallToActionButton";
import whatsapp from "../../assets/icons/whatsapp.png";
import { addAddOn, startLoading } from "../../Redux/AddOnSlice/AddOnSlice";
import { fetchingData } from "../../Data";

const Layout = () => {
  const { message, type } = useSelector((state) => state.error);
  const [hasMounted, setHasMounted] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { addon } = useSelector((state) => state.addon);
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // setting decrypt user data
    if (user) {
      dispatch(handleCurrentUser(user));
    }
    // if selectedLocation is not present than open popup modal
    if (selectedLocation === null) {
      dispatch(toggleLocationModal(true));
    }
  }, [user, selectedLocation]);

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    if (location.pathname == `/search/${id}` || location.pathname == "/") {
      dispatch(handleRestCoupon());
    }

    if (localStorage.getItem("tempBooking")) {
      localStorage.removeItem("tempBooking");
    }
    // this will user to top of the screen whenever user change the page
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (addon?.length > 0) return;

    (async () => {
      dispatch(startLoading());
      const response = await fetchingData("/addOn?page=1&limit=50");
      if (response?.status === 200) {
        dispatch(addAddOn(response));
      }
    })();
  }, []);

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
          phoneNumber={"+91 8884488891"}
        />
        <Header />
      </header>
      <main className="relative" style={{ minHeight: "calc(100vh - 108.8px)" }}>
        <Outlet />
        <CallToActionButton
          image={whatsapp}
          link={"https://wa.me/+918884488891"}
        />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
