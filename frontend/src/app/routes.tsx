import { lazy, memo } from "react";
import { useRoutes } from "react-router-dom";

const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const Calendar = lazy(() => import("../pages/dashboard/sartarosh/calendar"));
const Booking = lazy(() => import("../pages/dashboard/sartarosh/booking"));
const Service = lazy(() => import("../pages/dashboard/sartarosh/service"));
const Comment = lazy(() => import("../pages/dashboard/sartarosh/comment"));
const Profile = lazy(() => import("../pages/profile"));
const Login = lazy(() => import("../pages/auth/login"));
const Register = lazy(() => import("../pages/auth/register"));

const AppRouter = () => {
  return useRoutes([
    {
      path: "login",
      element: <Login />, 
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { path: "booking", element: <Booking /> },
        { path: "service", element: <Service /> },
        { path: "comment", element: <Comment /> },
        { path: "profile", element: <Profile /> },
        { index: true, element: <Calendar /> },
      ],
    },
  ]);
};

export default memo(AppRouter);
