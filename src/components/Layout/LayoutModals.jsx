import { lazy, Suspense } from "react";
import Alert from "../Alert/Alert";
import { useSelector } from "react-redux";
const LoginModal = lazy(() => import("../Modals/LoginModal"));
const RegisterModal = lazy(() => import("../Modals/RegisterModal"));
const SignOutModal = lazy(() => import("../Modals/SignOutModal"));
const LocationModal = lazy(() => import("../Modals/LocationModal"));
const Sidebar = lazy(() => import("../Sidebar/Sidebar"));

const LayoutModals = () => {
  const { message, type } = useSelector((state) => state.error);
  return (
    <>
      <Suspense fallback={null}>
        <LoginModal />
        <SignOutModal />
        <RegisterModal />
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
