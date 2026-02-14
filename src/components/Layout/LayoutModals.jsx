import { lazy, Suspense } from "react";
import LoginModal from "../Modals/LoginModal";
import RegisterModal from "../Modals/RegisterModal";
import SignOutModal from "../Modals/SignOutModal";
import Alert from "../Alert/Alert";
import { useSelector } from "react-redux";
const LocationModal = lazy(() => import("../Modals/LocationModal"));
const Sidebar = lazy(() => import("../Sidebar/Sidebar"));

const LayoutModals = () => {
  const { message, type } = useSelector((state) => state.error);
  return (
    <>
      <LoginModal />
      <SignOutModal />
      <RegisterModal />

      <Suspense fallback={null}>
        <LocationModal />
      </Suspense>

      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      {message && <Alert error={message} errorType={type} />}
    </>
  );
};

export default LayoutModals;
