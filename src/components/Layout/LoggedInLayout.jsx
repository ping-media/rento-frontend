import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../Account/Sidebar";
import { useSelector } from "react-redux";

const LoggedInLayout = () => {
  const { user } = useSelector((state) => state.user);
  return user != null ? (
    <div className="grid grid-cols-4 w-[90%] my-10 mx-auto gap-2">
      <div className="hidden lg:block col-span-1">
        <SideBar />
      </div>
      <div className="col-span-4 lg:col-span-3">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default LoggedInLayout;
