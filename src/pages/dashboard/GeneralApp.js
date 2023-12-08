// React
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';

// Services
import UserService from '../../services/user.service';
import TokenService from '../../services/token.service';
import DeskUserService from '../../services/desk.user.service';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [dashboardDetails, setDashboardDetails] = useState({ status: false, data: {} });
  const adminId = TokenService.getUser("userDetails")?.userInfo.id
  const spaceId = TokenService.getData("userDetails")?.space_id

  const [recentUsers, setRecentUsers] = useState([]);
  const [userengagement, setUserengagement] = useState({});

  useEffect(() => {
    console.log(dashboardDetails)

    // PANEL//

    if (!dashboardDetails.status) {
      UserService.DashboardDetails(adminId).then((response) => {
        console.log("res=>:",response);
        handleDashboardDetails(response)
        setRecentUsers(response.data.cards.recentusers)
        setUserengagement(response.data.cards.userengagements)
      })

      // PANEL //


      // SPACE //

      // console.log(spaceId);
      // DeskUserService.getDashBoardDetails(adminId, spaceId).then((response) => {
      //   response = response.data
      //   console.log(response)
      //   handleDashboardDetails(response)
      //   setRecentUsers(response.data.cards.recentusers)
      //   setUserengagement(response.data.cards.userengagements)
      // }).catch(err => {
      //   console.log("errrr");
      //   console.log(err);
      // })

      // SPACE //
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardDetails]);

  const handleDashboardDetails = (details) => {
    if (details.data?.cards) {
      setDashboardDetails(
        {
          status: details.status,
          data: { cards: details.data.cards }
        }
      )
    }
  }

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={8}>
            <AppWelcome displayName={user?.displayName} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured />
          </Grid> */}

          <Grid item xs={3} md={3}>
            <AppWidgetSummary
              title="Total Users"
              percent={false}
              total={dashboardDetails.status ? dashboardDetails.data.cards.totalUsers : 0}
              chartColor={theme.palette.primary.main}
              chartData={[1, 2, 3, 4]}
            // chartData={dashboardDetails.status? dashboardDetails.data.cards.userArr:[1,2,3,4]} // [5, 18, 12, 51, 68, 11, 39, 37, 27, 20]
            />
          </Grid>

          <Grid item xs={3} md={3}>
            <AppWidgetSummary
              title="Total Messages"
              percent={false}
              total={dashboardDetails.status ? dashboardDetails.data.cards.totalMsgs : 0}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={3} md={3}>
            <AppWidgetSummary
              title="New users(this Month)"
              percent={false}
              total={dashboardDetails.status ? dashboardDetails.data.cards.monthlyUsers : 0}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={3} md={3}>
            <AppWidgetSummary
              title="Messages (this Month)"
              percent={false}
              total={dashboardDetails.status ? dashboardDetails.data.cards.monthlyMsgreport : 0}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <AppTopAuthors recentUsers={recentUsers} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid>
          */}

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled userengagement={userengagement} />
          </Grid>

          {/* <Grid item xs={12} lg={8}>
            <AppNewInvoice />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries />
          </Grid>
          */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48} />
              <AppWidget title="Applications" total={55566} icon={'eva:email-fill'} color="warning" chartData={75} />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
