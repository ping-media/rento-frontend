import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import TopHeader from "../Header/TopHeader";
import Header from "../Header/Header";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { handleCurrentUser } from "../../Redux/UserSlice/UserSlice";
// import Footer from "../Footer/Footer";
const Footer = lazy(() => import("../Footer/Footer"));
import { handleRestCoupon } from "../../Redux/CouponSlice/CouponSlice";
import { toggleLocationModal } from "../../Redux/ModalSlice/ModalSlice";
import CallToActionButton from "../CallToAction/CallToActionButton";
import whatsapp from "../../assets/icons/whatsapp.webp";
import { addAddOn, startLoading } from "../../Redux/AddOnSlice/AddOnSlice";
import { fetchingData } from "../../Data";
import { fetchingPlansFilters } from "../../Data/Functions";
import PreLoader from "../skeleton/PreLoader";
import {
  addGeneralSettings,
  stopSettingLoading,
} from "../../Redux/SettingSlice/SettingSlice";
import LayoutModals from "./LayoutModals";
import BottomInstallBanner from "../Banner/BottomInstallBanner";

const Layout = () => {
  const { maintenance, info, loading } = useSelector((state) => state.general);
  const [hasMounted, setHasMounted] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { addon } = useSelector((state) => state.addon);
  const { selectedLocation } = useSelector(
    (state) => state.selectedLocation,
    shallowEqual,
  );
  const { filter } = useSelector((state) => state.filter, shallowEqual);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const waContact = useMemo(
    () => info?.waContact || "8884488891",
    [info?.waContact],
  );

  // top header data
  const topHeaderProps = useMemo(
    () => ({
      email: info?.email || "support@rentobikes.com",
      phoneNumber: `+91 ${info?.contact || "8884488891"}`,
      altPhoneNumber: `+91 ${info?.altContact || "--"}`,
    }),
    [info?.email, info?.contact, info?.altContact],
  );

  useEffect(() => {
    // setting decrypt user data
    if (user) dispatch(handleCurrentUser(user));

    // if selectedLocation is not present than open popup modal
    if (selectedLocation === null) {
      import("../Modals/LocationModal"); // preload chunk
      dispatch(toggleLocationModal(true));
    }
  }, [user, selectedLocation]);

  const fetchAddOns = useCallback(async () => {
    if (addon?.length) return;

    try {
      dispatch(startLoading());
      const res = await fetchingData("/addOn?isWeb=true");
      if (res?.status === 200) {
        dispatch(addAddOn(res));
        dispatch(addGeneralSettings(res));
      }
    } finally {
      dispatch(stopSettingLoading());
    }
  }, [addon?.length, dispatch]);

  // useEffect(() => {
  //   fetchAddOns();
  // }, [fetchAddOns]);

  // let first render happen without data to improve the performance
  useEffect(() => {
    if (addon?.length) return;

    const idleCallback =
      window.requestIdleCallback ||
      function (cb) {
        return setTimeout(cb, 1);
      };

    idleCallback(() => {
      fetchAddOns();
      import("../Modals/LocationModal");
    });
  }, [fetchAddOns, addon?.length]);

  useEffect(() => {
    if (maintenance && location.pathname !== "/maintenance") {
      navigate("/maintenance", { replace: true });
    }

    if (!maintenance && location.pathname === "/maintenance") {
      navigate("/", { replace: true });
    }
  }, [maintenance, location.pathname]);

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    if (location.pathname == `/search/${id}` || location.pathname == "/") {
      dispatch(handleRestCoupon());
    }

    // this will user to top of the screen whenever user change the page
    window.scrollTo(0, 0);
  }, [location.pathname, id, dispatch]);

  // useEffect(() => {
  //   if (!filter.length) {
  //     fetchingPlansFilters(dispatch);
  //   }
  // }, [filter?.length, dispatch]);

  useEffect(() => {
    if (filter?.length) return;

    const idle =
      window.requestIdleCallback ||
      function (cb) {
        return setTimeout(cb, 1);
      };

    idle(() => {
      fetchingPlansFilters(dispatch);
    });
  }, [filter?.length, dispatch]);

  if (loading) {
    return <PreLoader showLogo />;
  }

  return (
    <>
      {/* login & register modals */}
      <LayoutModals />

      {/* main section  */}
      <header className="sticky top-0 z-20">
        <TopHeader {...topHeaderProps} />
        <Header />
      </header>

      <main className="relative" style={{ minHeight: "calc(100vh - 108.8px)" }}>
        <Outlet />

        <CallToActionButton
          image={whatsapp}
          link={`https://wa.me/+91${waContact}`}
        />
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <BottomInstallBanner />
    </>
  );
};

export default Layout;
