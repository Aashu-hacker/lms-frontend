// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      roles: ['admin','analyst', 'manager', 'client'],
      breadcrumbs: false
    }
  ]
};

const getDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role?.toLowerCase();

  return {
    ...dashboard,
    // children: dashboard.children.filter((menu) => {
    //   if (!menu.roles) return true;
    //   return menu.roles.includes(role);
    // })
  };
};


export default getDashboard;
