import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

// admin pages
const UsersPage = Loadable(lazy(() => import('views/admin/Users')));
const ClientsPage = Loadable(lazy(() => import('views/admin/Clients')));

// Projects
const ProjectsPage = Loadable(lazy(() => import('views/admin/projects/ProjectsListPage')));
const AddProjectPage = Loadable(lazy(() => import('views/admin/projects/AddProject')));
const ViewProjectVersions = Loadable(lazy(() => import('views/admin/projects/ViewProjectVersions')));
const CreateReport = Loadable(lazy(() => import('views/admin/projects/CreateReport')));
const ReportsPage = Loadable(lazy(() => import('views/admin/reports/ReportsPage')));

const AdminRoutes = {
  path: '/admin',
  element: (
    <ProtectedRoute roles={['admin', 'manager', 'analyst']}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    // 👤 Users
    {
      path: 'users',
      element: (
        <ProtectedRoute roles={['admin']}>
          <UsersPage />
        </ProtectedRoute>
      )
    },

    // 🏢 Clients
    {
      path: 'clients',
      element: (
        <ProtectedRoute roles={['admin', 'manager']}>
          <ClientsPage />
        </ProtectedRoute>
      )
    },

    // 📁 Projects Listing
    {
      path: 'projects',
      element: (
        <ProtectedRoute roles={['admin', 'manager', 'analyst']}>
          <ProjectsPage />
        </ProtectedRoute>
      )
    },

    // ➕ Add Project
    {
      path: 'projects/add',
      element: (
        <ProtectedRoute roles={['admin', 'manager']}>
          <AddProjectPage />
        </ProtectedRoute>
      )
    },
    // ➕ View Project Versions

    {
      path: 'projects/:id/versions',
      element: (
        <ProtectedRoute roles={['admin', 'manager', 'analyst']}>
          <ViewProjectVersions />
        </ProtectedRoute>
      )
    },

    // ➕ Create Report Versions
    {
      path: 'projects/:id/versions/:versionId',
      element: (
        <ProtectedRoute roles={['admin', 'manager', 'analyst']}>
          <CreateReport />
        </ProtectedRoute>
      )
    },

    {
      path: 'reports',
      element: (
        <ProtectedRoute roles={['admin', 'manager', 'analyst']}>
          <ReportsPage />
        </ProtectedRoute>
      )
    }
  ]
};

export default AdminRoutes;
