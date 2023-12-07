import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  TableHead,
  Paper,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
// import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// sections
// import UserListHead from './UserListHead';
// import UserListToolbar from './UserListToolbar';
import UserMoreMenu from './UserMoreMenu';

// hooks
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ChannelManage({ appMockups, formFields, ChannelApi }) {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const adminId = user?.id
  // const [appList, setAppList] = useState([]); // _userList
  const [channelList, setChannelList] = useState([]); // Channel List
  useEffect(() => {
    console.log(channelList)
  }, [channelList])

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alertData, setAlertData] = useState({ status: false, ack: 'something went wrong, try again later' });


  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = channelList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = async (channelId) => {
    const deleteUser = channelList.filter((user) => user.channelId !== channelId);
    // console.log("--Chl-Manage--", channelList.filter((user) => user.channelId === channelId));
    const channelType = (channelList.filter((user) => user.channelId === channelId))[0];
    const channel_Type = channelType.channelType;
    console.log("--ChlMg", channelType, channel_Type);
    setSelected([]);

    const response = await ChannelApi.delChannel(adminId, channelId, channel_Type)
    const { status, ack } = response;
    console.info("response", response)
    if (response) {
      setChannelList(deleteUser)
      setAlertData({ status, ack });
      if (!status) {
        enqueueSnackbar(ack, { variant: 'error' });
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return 'ok';
    }

    ;
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = channelList.filter((user) => !selected.includes(user.name));
    setSelected([]);
    setChannelList(deleteUsers);
  };

  function getAvatarUrl(AppName) {
    const avatarUrl = appMockups.find((item) => item.app === AppName)
    return avatarUrl ? avatarUrl.photoURL : null;
  }

  function getAppDisplayName(AppName) {
    const avatarUrl = appMockups.find((item) => item.app === AppName)
    return avatarUrl ? avatarUrl.displayName : null;
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - channelList.length) : 0;

  const filteredUsers = channelList ? applySortFilter(channelList, getComparator(order, orderBy), filterName) : {};

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  // --------------------------------------------------------------

  useEffect(() => {
    ChannelApi.getChannel(adminId).then((channelListData) => {
      console.log("--Fetched--", channelListData);
      if (channelListData.status) {
        // setChannelList(() => {
        //   return channelListData.data.channels
        // })

        setChannelList(channelListData.data.channels);
      }
    })
  }, [])



  // --------------------------------------------------------------

  return (
    <Page title="Channel: Management">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {/* Include HeaderBreadcrumbs here if needed */}

        <Card>
          {/* Include UserListToolbar here if needed */}

          {channelList && channelList.length > 0 ? (
            <Scrollbar>
              {/* <TableContainer sx={{ minWidth: 800 }}>
                <Table />
              </TableContainer> */}

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell >Channel Type</TableCell>
                      <TableCell align="right">Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {channelList.map((channel) => (
                      <TableRow
                        key={channel.channelId}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {channel.channelId}
                        </TableCell>
                        <TableCell>
                          {channel.channelType}
                        </TableCell>
                        <TableCell align="right">{channel.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>


            </Scrollbar>
          ) : (
            <Typography variant="subtitle1" align="center">
              No channels added.
            </Typography>
          )}

          {channelList && channelList.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={channelList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, page) => setPage(page)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Card>
      </Container>
    </Page>
  );



  // ----------------------------------------------------------------------


  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis?.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) return array.filter((_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    return stabilizedThis.map((el) => el[0]);
  }
}
