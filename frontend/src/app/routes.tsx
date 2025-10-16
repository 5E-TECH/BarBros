import { lazy, memo } from 'react';
import { useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(() => import('../layout/DashboardLayout'))
const Department = lazy(() => import('../pages/dashboard/sartarosh/department'))
const Rating = lazy(() => import('../pages/dashboard/sartarosh/rating'))
const WorkHours = lazy(() => import('../pages/dashboard/sartarosh/work-hours'))

const AppRouter = () => {
  return useRoutes([
    {path: '/', element: <DashboardLayout/>, children: [
      {index: true, element: <Department/>},
      {path: "rating", element: <Rating/>},
      {path: "clock", element: <WorkHours/>}
    ]}
  ])
};

export default memo(AppRouter);