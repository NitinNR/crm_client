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

import ChannelList from './ChannelList'
import ChannelManage from './ChannelManage'

// ----------------------------------------------------------------------

// services 

import ApplicationService from '../../services/applications.service';
import ChannelApi from '../../services/channel.service';

import useAuth from '../../hooks/useAuth';


const formFields = [
  { channelName: "lifeelspace", Name: "Integration Name", AccountID: "Account Id", ApiKey: "API KEY", url: "Panel URL" },
  { channelName: "whatsapp", title: "WhatsApp Channel",description: "Connect with customers seamlessly via WhatsApp", "API_Provider": ["WhatsApp Cloud", "360Dialog"], name: "Channel Name",  phoneNumber: "Phone number", phoneNumberID: "Phone number ID", businessAccID: "Business Account ID", ApiKey: "API KEY" },
  { channelName: "sms", title: "SMS Channel",description: "Connect with customers seamlessly via SMS", "API_Provider": [ "Twilio"],  name: "Channel Name", phoneNumber: "Phone number", AccSID: "Account SID", AuthToken: "Auth Token" },
  ];

// ----------------------------------------------------------------------

export default function ChannelApps() {

  const { user } = useAuth();
  const adminId = user?.id

  const [appMockups, setAppMockups] = useState([
    {
    app: 'whatsapp',
    displayName: 'WhatsApp',
    icon: 'icon-',
    photoURL: 'https://space.lifeel.in/assets/images/dashboard/channels/whatsapp.png',
    enabled:true
    },
    {
    app: 'sms',
    displayName: 'SMS',
    photoURL: 'https://space.lifeel.in/assets/images/dashboard/channels/sms.png',
    enabled:false

    },
    {
    app: 'email',
    displayName: 'Email',
    photoURL: 'https://space.lifeel.in/assets/images/dashboard/channels/email.png',
    enabled:false

    },
  ])


  const [channelMockups, setChannelMockups] = useState([
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
  

  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Add App');

  const ACCOUNT_TABS = [
    {
      value: 'Add App',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <ChannelList appMockups={appMockups} formFields={formFields} ChannelApi={ChannelApi} />,
    },
    {
      value: 'Manage App',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <ChannelManage appMockups={appMockups} formFields={formFields} ChannelApi={ChannelApi} />,
    },
  ];

  return (
    <Page title="Channels">
      <Container maxWidth={themeStretch ? false : 'lg'}>
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
