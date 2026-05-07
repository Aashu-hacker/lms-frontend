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
const EditProjectPage = Loadable(lazy(() => import('views/admin/projects/EditProject')));
const ProjectDetailsPage = Loadable(lazy(() => import('views/admin/projects/ProjectDetails')));

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

    // ✏️ Edit Project
    {
      path: 'projects/edit/:id',
      element: (
        <ProtectedRoute roles={['admin', 'manager']}>
          <EditProjectPage />
        </ProtectedRoute>
      )
    },

    // 👁 View Project
    {
      path: 'projects/:id',
      element: (
        <ProtectedRoute roles={['admin', 'manager', 'analyst']}>
          <ProjectDetailsPage />
        </ProtectedRoute>
      )
    }
  ]
};

export default AdminRoutes;