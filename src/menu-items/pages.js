// assets
import {
  IconUsers,
  IconBuilding,
  IconFileText,
  IconReport,
  IconClipboardCheck,
  IconMessageCircle,
  IconSend,
  IconEye,
  IconCheck,
  IconGitBranch
} from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconBuilding,
  IconFileText,
  IconReport,
  IconClipboardCheck,
  IconMessageCircle,
  IconSend,
  IconEye,
  IconCheck,
  IconGitBranch
};

// ✅ Get logged-in user safely
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

const user = getUser();
const role = user?.role?.toLowerCase() || null;

// ==============================|| ROLE BASED MENU ||============================== //

const pages = {
  id: 'pages',
  caption: 'Navigation',
  type: 'group',
  children: [
    // ================= ADMIN =================
    {
      id: 'admin-panel',
      title: 'Admin Panel',
      type: 'collapse',
      icon: icons.IconUsers,
      roles: ['admin'],
      children: [
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          url: '/admin/users',
          icon: icons.IconUsers
        },
        {
          id: 'clients',
          title: 'Clients',
          type: 'item',
          url: '/admin/clients',
          icon: icons.IconBuilding
        },
        {
          id: 'projects',
          title: 'Projects',
          type: 'item',
          url: '/admin/projects',
          icon: icons.IconGitBranch
        },
        {
          id: 'reports',
          title: 'Reports',
          type: 'item',
          url: '/admin/reports',
          icon: icons.IconReport
        }
      ]
    },

    // ================= CLIENT =================
    {
      id: 'client-panel',
      title: 'Client Panel',
      type: 'collapse',
      icon: icons.IconBuilding,
      roles: ['client'],
      children: [
        {
          id: 'client-report',
          title: 'View Final Reports',
          type: 'item',
          url: '/client/client-report',
          icon: icons.IconEye
        }
      ]
    },

    // ================= ANALYST =================
    {
      id: 'analyst-panel',
      title: 'Analyst Panel',
      type: 'collapse',
      icon: icons.IconFileText,
      roles: ['analyst'],
      children: [
        {
          id: 'projects',
          title: 'Projects',
          type: 'item',
          url: '/analyst/projects',
          icon: icons.IconGitBranch
        },
        // {
        //   id: 'create-report',
        //   title: 'Create Reports',
        //   type: 'item',
        //   // url: '/analyst/create-report',
        //   url: '#',
        //   icon: icons.IconFileText
        // },
        // {
        //   id: 'edit-report',
        //   title: 'Edit Reports',
        //   type: 'item',
        //   // url: '/analyst/edit-report',
        //   url: '#',
        //   icon: icons.IconClipboardCheck
        // },
        // {
        //   id: 'submit-report',
        //   title: 'Submit to Manager',
        //   type: 'item',
        //   // url: '/analyst/submit-report',
        //   url: '#',
        //   icon: icons.IconSend
        // },
        // {
        //   id: 'rejected-reports',
        //   title: 'Rejected Reports',
        //   type: 'item',
        //   url: '/analyst/rejected-reports',
        //   // url: '#',
        //   icon: icons.IconMessageCircle
        // }
        // {
        //   id: 'internal-version',
        //   title: 'Internal Versions',
        //   type: 'item',
        //   // url: '/analyst/internal-versions',
        //   url: '#',
        //   icon: icons.IconGitBranch
        // }
      ]
    },

    // ================= MANAGER =================
    {
      id: 'manager-panel',
      title: 'Manager Panel',
      type: 'collapse',
      icon: icons.IconClipboardCheck,
      roles: ['manager'],
      children: [
        {
          id: 'projects',
          title: 'Projects',
          type: 'item',
          url: '/manager/projects',
          icon: icons.IconGitBranch
        },
        {
          id: 'submitted-reports',
          title: 'Submitted Reports',
          type: 'item',
          url: '/manager/submitted-reports',
          icon: icons.IconEye
        }
        // {
        //   id: 'reports/add-comment',
        //   title: 'Add Comments',
        //   type: 'item',
        //   url: '/manager/comments',
        //   // url: '#',
        //   icon: icons.IconMessageCircle
        // // },
        // {
        //   id: 'approve-reports',
        //   title: 'Approve / Send Back',
        //   type: 'item',
        //   // url: '/manager/approve-reports',
        //   url: '#',
        //   icon: icons.IconCheck
        // },
        // {
        //   id: 'forward-client',
        //   title: 'Forward to Client',
        //   type: 'item',
        //   // url: '/manager/forward-client',
        //   url: '#',
        //   icon: icons.IconSend
        // },
        // {
        //   id: 'external-version',
        //   title: 'External Versions',
        //   type: 'item',
        //   // url: '/manager/external-versions',
        //   url: '#',
        //   icon: icons.IconGitBranch
        // }
      ]
    }
  ]
};

// ================= FILTER ROLE BASED MENU =================
pages.children = pages.children.filter((menu) => !menu.roles || menu.roles.includes(role));

export default pages;
