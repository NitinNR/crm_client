import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// sections
// import {
//   AccountGeneral,
//   AccountBilling,
//   AccountLabels,
//   AccountNotifications,
//   AccountChangePassword,
// } from '../../sections/@dashboard/user/account';

import ApplicationList from './ApplicationList'
import ApplicationManage from './ApplicationManage'

// ----------------------------------------------------------------------

// services 

import ApplicationService from '../../services/applications.service';

import useAuth from '../../hooks/useAuth';


const formFields = [
  { channelName: "lifeelspace", Name: "Integration Name", AccountID: "Account Id", ApiKey: "API KEY", url: "Panel URL" },
  // { channelName: "dialogflow", projectId: "Project Id", JsonKey: "JSON KEY" },
  // { channelName: "google_sheet", projectId: "Project Id", JsonKey: "JSON KEY" },
  // { channelName: "dialogflow", projectId: "project Id", credentials: "credentials" },
  ];

// ----------------------------------------------------------------------

export default function UserAccount() {

  const { user } = useAuth();
  const adminId = user?.id

  const [appMockups, setAppMockups] = useState([
    {
    app: 'lifeelspace',
    displayName: 'LifeelSpace',
    icon: 'icon-',
    photoURL: 'https://space.lifeel.in/brand-assets/logo_thumbnail.svg',
    enabled:true
    },
    {
    app: 'dialogflow',
    displayName: 'Dialogflow',
    photoURL: 'https://i0.wp.com/hirendave.tech/wp-content/uploads/2019/01/unnamed-1.png',
    enabled:false

    },
    {
    app: 'google_sheet',
    displayName: 'Google Sheet',
    photoURL: 'https://i0.wp.com/www.alphr.com/wp-content/uploads/2020/06/how-to-add-google-sheet-to-desktop.jpg',
    enabled:false

    },
  ])


  useEffect(() => {
    ApplicationService.AppList(adminId).then((AppListData)=>{
      if(AppListData.status){
        AppListData.data.forEach(element => {
          if(element.AppName === "lifeelspace"){
            setAppMockups(prevAppMockups => {
              const updatedAppMockups = prevAppMockups.map(item => {
                if (item.app === "lifeelspace") {
                  return {
                    ...item,
                    enabled: false
                  };
                }
                return item;
              });
          
              return updatedAppMockups;
            });
          }
        });
      }
    })
  }, [])
  

  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Add App');

  const ACCOUNT_TABS = [
    {
      value: 'Add App',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <ApplicationList appMockups={appMockups} formFields={formFields} ApplicationService={ApplicationService} />,
    },
    {
      value: 'Manage App',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <ApplicationManage appMockups={appMockups} formFields={formFields} ApplicationService={ApplicationService} />,
    },
  ];

  return (
    <Page title="Applications">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {/* <HeaderBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Account Settings' },
          ]}
        /> */}

        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={(e, value) => setCurrentTab(value)}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
