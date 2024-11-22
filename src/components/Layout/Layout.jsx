import { Outlet } from "react-router-dom";
import TopHeader from "../Header/TopHeader";
import Header from "../Header/Header";
import LoginModal from "../Modals/LoginModal";
import RegisterModal from "../Modals/RegisterModal";
import LocationModal from "../Modals/LocationModal";
import Sidebar from "../Sidebar/Sidebar";
import Alert from "../Alert/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { handleCurrentUser } from "../../Redux/UserSlice/UserSlice";
import SignOutModal from "../Modals/SignOutModal";

const Layout = () => {
  const { message, type } = useSelector((state) => state.error);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // setting decrypt user data
      dispatch(handleCurrentUser(user));
    }
  }, [user]);

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
      <header>
        <TopHeader
          email={"someone@example.com"}
          phoneNumber={"+91 9087654321"}
        />
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
