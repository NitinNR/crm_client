import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  TablePagination,
  LinearProgress
} from '@mui/material';

import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { Modal } from 'antd';


// Moment
import Moment from 'react-moment';
import 'moment-timezone';
///

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/broadcast/list';

import TokenService from "../../services/token.service"

// broadcast service 
import { broadcastList, deleteBroadcast } from '../../services/broadcasts.service';



// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'srno', label: 'Sr.No', alignRight: false },
  { id: 'name', label: 'Title', alignRight: false },
  // { id: 'message', label: 'Message content', alignRight: false },
  { id: 'audience_type', label: 'Audience Type', alignRight: false },
  { id: 'inbox_name', label: 'Inbox/Channel', alignRight: false },
  // { id: 'template_id', label: 'Template', alignRight: false },
  { id: 'schedule_at', label: 'Schedule At', alignRight: false },
  { id: 'created_at', label: 'Created At', alignRight: false },
  { id: 'by', label: 'Source', alignRight: false },
];

// ----------------------------------------------------------------------

const userId = TokenService.getUserID();
const spaceId = TokenService.getData("userDetails").space_id;
const mytz = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function BroadcastList() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [broadcastLists, setBroadcastList] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(mytz);
  }, [])

  useEffect(async () => {
    const broadcasts = await broadcastList(userId, spaceId, page, rowsPerPage, filterName);
    setBroadcastList(broadcasts.data.data);
    setTotal(broadcasts.data.total)
    setIsLoading(false)
  }, [page, rowsPerPage, filterName])

  const theme = useTheme();
  const { themeStretch } = useSettings();


  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = broadcastLists.map((n) => n.name);
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

  const handleDeleteUser = async (bid) => {
    setIsLoading(true)

    const deleteStatus = await deleteBroadcast(userId, bid)

    if (deleteStatus.status === 200) {
      broadcastLists.filter((broadcast) => broadcast.id !== bid);
      setSelected([]);
      const broadcasts = await broadcastList(userId, spaceId, page, rowsPerPage, filterName);
      setBroadcastList(broadcasts.data.data);
      setTotal(broadcasts.data.total)
      setIsLoading(false)
    }


  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = broadcastLists.filter((user) => !selected.includes(user.name));
    setSelected([]);
    setBroadcastList(deleteUsers);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - broadcastLists.length) : 0;

  const filteredUsers = applySortFilter(broadcastLists, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  const [isModalOpen, setModal] = useState(false);





  const Loading = () => {

  }
  return (
    <Page title="Broadcast: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Dialog
          open={isModalOpen}
          // onClose={handleClose}
          // PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Choose Broadcast
          </DialogTitle>
          <DialogContent>
            <Button component={RouterLink}
              to={PATH_DASHBOARD.broadcast.ccreate}>By Channel</Button>
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.broadcast.create}
            >By LifeelSpace</Button>
          </DialogContent>
        </Dialog>
        <HeaderBreadcrumbs
          heading="Broadcasting"
          action={
            <Button
              variant="contained"
              component={RouterLink}
              // to={PATH_DASHBOARD.broadcast.create}
              to={PATH_DASHBOARD.broadcast.ccreate}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              // onClick={() => { setModal(true) }}
            >
              New Broadcast
            </Button>
          }
        />

        {
          !isLoading ?
            <Card>
              <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                onDeleteUsers={() => handleDeleteMultiUser(selected)}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserListHead
                      needcheckbox={false}
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={total}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers.map((row, index) => {
                        const { id, title, message, audience_type, inbox_name, template_id, schedule_at, created_at,source } = row;
                        const isItemSelected = selected.indexOf(title) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            {/* <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} onClick={() => handleClick(title)} />
                            </TableCell> */}

                            <TableCell>{(page * rowsPerPage) + index + 1}</TableCell>
                            <TableCell>{title}</TableCell>
                            {/* <TableCell align="left">{message}</TableCell> */}
                            <TableCell align="left">{(() => {
                              switch (audience_type) {
                                case 0:
                                  return "Tag based";
                                case 1:
                                  return "Custom";
                                default:
                                  return "All";
                              }
                            })()}</TableCell>
                            <TableCell align="left">{!inbox_name?"WhatsApp":inbox_name}</TableCell>
                            {/* <TableCell align="left">{template_id}</TableCell> */}
                            {/* <TableCell align="left"><Moment tz={mytz} format="YYYY/MM/DD hh:mm A">{new Date(parseInt(schedule_at, 10))}</Moment></TableCell> */}
                            <TableCell align="left"><Moment tz={mytz} format="YYYY/MM/DD hh:mm A">{schedule_at}</Moment></TableCell>
                            <TableCell align="left"><Moment tz={mytz} format="YYYY/MM/DD  hh:mm A">{created_at}</Moment></TableCell>

                            <TableCell align="center">
                              <Badge badgeContent={source} color={source==="Application"?"primary":"success"}>
                                {/* <Iconify icon={'fluent:channel-16-filled'} width={22} height={22} /> */}
                              </Badge>
                            </TableCell>
                            {/*
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={type === '0' ? 'warning' : 'primary'}
                          >
                            {sentenceCase(type === "0" ? "Lable" : "Number")}
                          </Label>
                        </TableCell> */}
                            {/* <TableCell align="left">{message}</TableCell> */}
                            {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'banned' && 'error') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                            <TableCell align="right">
                              <UserMoreMenu bid={id} onDelete={() => handleDeleteUser(id)} broadcastName={title} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {/* {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )} */}
                    </TableBody>
                    {isNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[2, 5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, page) => setPage(page)}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card> : <LinearProgress />
        }


      </Container>
    </Page>
  );
}

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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user.title?.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
