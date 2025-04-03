import React, { lazy, useEffect, useState } from "react";
import UserDocument from "../components/Account/UserDocument";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoginModal } from "../Redux/ModalSlice/ModalSlice";
import { useNavigate } from "react-router-dom";
const SelfieModal = lazy(() => import("../components/Modals/SelfieModal.jsx"));
const IdentityModal = lazy(() => import("../components/Modals/IdentityModal"));
const LicenseModal = lazy(() => import("../components/Modals/LicenseModal"));

const Kyc = () => {
  const { user } = useSelector((state) => state.user);
  const { isLoginModalActive, isRegisterModalActive } = useSelector(
    (state) => state.modals
  );
  const [hasOpenedModal, setHasOpenedModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null && window.location.pathname === "/kyc") {
      dispatch(toggleLoginModal(true));
      setHasOpenedModal(true);
    }
  }, [user]);

  useEffect(() => {
    if (!hasOpenedModal || window.location.pathname !== "/kyc") return;

    if (!isLoginModalActive && !isRegisterModalActive) {
      if (user !== null) return;
      navigate("/");
    }
  }, [isLoginModalActive, isRegisterModalActive, hasOpenedModal]);

  return (
    <>
      <LicenseModal />
      <IdentityModal />
      <SelfieModal />
      <div className="px-6 py-4">
        <UserDocument pageTitle="Kyc documents" />
      </div>
    </>
  );
};

export default Kyc;
