import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

// Projects
const ProjectsPage = Loadable(lazy(() => import('views/admin/projects/ProjectsListPage')));
const AddProjectPage = Loadable(lazy(() => import('views/admin/projects/AddProject')));
const ReportsPage = Loadable(lazy(() => import('views/admin/reports/ReportsPage')));
const AddCommentReport = Loadable(lazy(() => import('views/admin/reports/AddCommentReport')));
  
const ManagerRoutes = {
  path: '/manager',
  element: (
    <ProtectedRoute roles={['admin', 'manager', 'analyst']}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    // 📁 Projects Listing
    {
      path: 'projects',
      element: (
        <ProtectedRoute roles={['manager']}>
          <ProjectsPage />
        </ProtectedRoute>
      )
    },

    // ➕ Add Project
    {
      path: 'projects/add',
      element: (
        <ProtectedRoute roles={['manager']}>
          <AddProjectPage />
        </ProtectedRoute>
      )
    },

    {
      path: 'reports/add-comment/:id/versions/:versionId',
      element: (
        <ProtectedRoute roles={['manager']}>
          <AddCommentReport />
        </ProtectedRoute>
      )
    },

    // 📊 Reports
    {
      path: 'submitted-reports',
      element: (
        <ProtectedRoute roles={['manager']}>
          <ReportsPage />
        </ProtectedRoute>
      )
    }
  ]
};

export default ManagerRoutes;