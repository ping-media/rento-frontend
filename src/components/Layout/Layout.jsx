import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { fetchingPlansFilters } from "../../Data/Functions";
import PreLoader from "../skeleton/PreLoader";
import {
  addGeneralSettings,
  stopSettingLoading,
} from "../../Redux/SettingSlice/SettingSlice";

const Layout = () => {
  const { message, type } = useSelector((state) => state.error);
  const { maintenance, info, loading } = useSelector((state) => state.general);
  const [hasMounted, setHasMounted] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { addon } = useSelector((state) => state.addon);
  const { selectedLocation } = useSelector((state) => state.selectedLocation);
  const { filter } = useSelector((state) => state.filter);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const waContact = (!loading && info.waContact) || "8884488891";

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
    if (addon?.length > 0) return;

    (async () => {
      try {
        dispatch(startLoading());
        const response = await fetchingData("/addOn?page=1&limit=50");
        if (response?.status === 200) {
          dispatch(addAddOn(response));
          dispatch(addGeneralSettings(response));
        }
      } finally {
        dispatch(stopSettingLoading());
      }
    })();
  }, []);

  useEffect(() => {
    if (maintenance) {
      navigate("/maintenance");
    } else {
      if (location.pathname === "/maintenance") {
        navigate("/");
      }
    }
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    if (location.pathname == `/search/${id}` || location.pathname == "/") {
      dispatch(handleRestCoupon());
    }

    // if (localStorage.getItem("tempBooking")) {
    //   localStorage.removeItem("tempBooking");
    // }
    // this will user to top of the screen whenever user change the page
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!filter || filter.length === 0) {
      fetchingPlansFilters(dispatch);
    }
  }, []);

  if (loading) {
    return <PreLoader />;
  }

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
          email={info?.email || "support@rentobikes.com"}
          phoneNumber={`+91 ${info.contact}` || "+91 8884488891"}
        />
        <Header />
      </header>
      <main className="relative" style={{ minHeight: "calc(100vh - 108.8px)" }}>
        <Outlet />
        <CallToActionButton
          image={whatsapp}
          link={`https://wa.me/+91${waContact}`}
        />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
