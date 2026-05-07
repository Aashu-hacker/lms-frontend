import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

// Projects
const ProjectsPage = Loadable(lazy(() => import('views/admin/projects/ProjectsListPage')));
const AddProjectPage = Loadable(lazy(() => import('views/admin/projects/AddProject')));

const AnalystRoutes = {
  path: '/analyst',
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
        <ProtectedRoute roles={['analyst']}>
          <ProjectsPage />
        </ProtectedRoute>
      )
    },

    // ➕ Add Project
    {
      path: 'projects/add',
      element: (
        <ProtectedRoute roles={['analyst']}>
          <AddProjectPage />
        </ProtectedRoute>
      )
    },
  ]
};

export default AnalystRoutes;