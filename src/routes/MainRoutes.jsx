import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    // 👉 Default route → Login page
    {
      path: '/',
      element: <LoginPage />
    },

    // 👉 After login routes (inside layout)
    {
      path: '/dashboard',
      element: <MainLayout />,
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },

    {
      path: '/typography',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <UtilsTypography />
        }
      ]
    },

    {
      path: '/color',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <UtilsColor />
        }
      ]
    },

    {
      path: '/shadow',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <UtilsShadow />
        }
      ]
    },

    {
      path: '/sample-page',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <SamplePage />
        }
      ]
    },

    // 👉 fallback
    {
      path: '*',
      element: <Navigate to="/" />
    }
  ]
};

export default MainRoutes;