import { createBrowserRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';
import AdminRoutes from './AdminRoutes';
import ManagerRoutes from './ManagerRoutes';
import AnalystRoutes from './AnalystRoutes';
import ClientRoutes from './ClientRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, AuthenticationRoutes, AdminRoutes, ManagerRoutes, AnalystRoutes, ClientRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
