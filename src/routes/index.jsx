import { createBrowserRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';
import AdminRoutes from './AdminRoutes';
import ManagerRoutes from './ManagerRoutes';
import AnalystRoutes from './AnalystRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, AuthenticationRoutes, AdminRoutes, ManagerRoutes, AnalystRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
