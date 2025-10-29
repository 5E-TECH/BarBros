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

const NotFound = lazy(() => import("../shared/ui/Notfound"))

const BarberShop = lazy(() => import("../pages/dashboard/admin/barberShop"))
const Users = lazy(() => import("../pages/dashboard/admin/users"))
const Statistic = lazy(() => import("../pages/dashboard/admin/statistic"))
const AuditLogs = lazy(() => import("../pages/dashboard/admin/auditLogs"))

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
        { index: true, element: <Calendar /> },
        { path: "booking", element: <Booking /> },
        { path: "service", element: <Service /> },
        { path: "comment", element: <Comment /> },
        { path: "profile", element: <Profile /> },
      ],
    },
    {path: "*", element: <NotFound/>},
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { path: "barbershop", element: <BarberShop /> },
        { path: "users", element: <Users /> },
        { path: "statistics", element: <Statistic /> },
        { path: "audit-logs", element: <AuditLogs /> },
      ],
    },

  ]);
};

export default memo(AppRouter);
