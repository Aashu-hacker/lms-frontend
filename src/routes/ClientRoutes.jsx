import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

// Projects
const ClientReportPage = Loadable(lazy(() => import('views/admin/reports/ClientReport')));
const ViewProjectVersionsClient = Loadable(lazy(() => import('views/admin/reports/ViewProjectVersionsClient')));
const AddClientCommentReport = Loadable(lazy(() => import('views/admin/reports/AddClientCommentReport')));

const ClientRoutes = {
  path: '/client',
  element: (
    <ProtectedRoute roles={['client']}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    // 📁 Projects Listing
    {
      path: 'client-report',
      element: (
        <ProtectedRoute roles={['client']}>
          <ClientReportPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'projects/:id/versions',
      element: (
        <ProtectedRoute roles={['client']}>
          <ViewProjectVersionsClient />
        </ProtectedRoute>
      )
    },
    {
      path: 'reports/add-comment/:id/versions/:versionId',
      element: (
        <ProtectedRoute roles={['client']}>
          <AddClientCommentReport />
        </ProtectedRoute>
      )
    }
  ]
};

export default ClientRoutes;
