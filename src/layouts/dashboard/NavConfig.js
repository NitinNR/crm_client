// component
import Iconify from '../../components/Iconify';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Users',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Channels',
    path: '/dashboard/channels',
    icon: getIcon('fluent:channel-16-filled'),
  },
  {
    title: 'Applications',
    path: '/dashboard/applications',
    icon: getIcon('tabler:apps-filled'),
  },
  {
    title: 'Broadcast',
    path: '/dashboard/broadcast',
    icon: getIcon('material-symbols:send-rounded'),
  },
  {
    title: 'Message Report',
    path: '/dashboard/report',
    icon: getIcon('mdi:report-box'),
  },
  {
    title: 'Settings',
    path: PATH_DASHBOARD.account.settings,
    icon: getIcon('uiw:setting'),
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];


export default navConfig;
