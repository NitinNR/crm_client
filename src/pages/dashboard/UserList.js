import { sentenceCase, paramCase } from 'change-case';
import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import {
  Card,
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Snackbar,
  Alert,
  TextField,
  DialogActions,
  LinearProgress,
  TableContainer,
  OutlinedInput,
  Chip,
  InputLabel,
  FormControl,
  MenuItem,
} from '@mui/material';
// Mui-X
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import GetAppIcon from '@mui/icons-material/GetApp';
// Ant design
import { Space, Tag, Divider, message } from 'antd';
import 'antd/dist/antd.css';
import { CaretDownOutlined, FormOutlined } from "@ant-design/icons";
// Moment
import * as moment from 'moment';
// 3rd party
import ShortUniqueId from 'short-unique-id';
// react-query
import {
  useQuery,
  // useQueryClient,
} from '@tanstack/react-query'

// hooks
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
// import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';
// Services
import UserService from '../../services/user.service';
import DeskUserService from '../../services/desk.user.service';
import TokenService from '../../services/token.service';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

const { CheckableTag } = Tag;

// const Alert = React.forwardRef((props, ref) => (
//   <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
// ));


export default function UserList() {
  const theme = useTheme();
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  // Access the client
  // const queryClient = useQueryClient()

  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');

  const adminId = TokenService.getUser().userInfo.id;
  const spaceId = TokenService.getData("userDetails").space_id;
  const [userPage, setUserPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [rowCountState, setRowCountState] = useState(0);
  const [openImport, setImportOpen] = useState(false);
  const [selectedImportTab, setSelectedImportTab] = useState(0);
  const [excelFile, setExcelFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [uploadResponse, setUploadResponse] = useState({status:false, ack:''}); // Track upload response
  const [Importloading, setImportLoading] = useState(false);


  const tagsData = ['Movies', 'Books', 'Music', 'Sports'];

  const uid = new ShortUniqueId({ length: 10 });

  const [selectedTags, setSelectedTags] = useState([]);

  let filterData = { filterValue: '', columnField: '', operatorValue: '', linkOperator: '', quickFilterValues: '' }

  // here
  const handleChangeTags = (tag, checked) => {
    console.log("handleChangeTags---", tag, checked);
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);

    if (nextSelectedTags.length > 0) {
      console.log("getTagBasedUsers---", adminId, rowsPerPage, userPage, nextSelectedTags);
      setIsLableFiltering(true);
      UserService.getTagBasedUsers(adminId, rowsPerPage, userPage, nextSelectedTags).then((response) => {
        console.log("RESP | getTagBasedUsers---", response);
        if (response) setRowCountState(response.data.total);
        setLoading(false);
        console.log("LIST---", response.data.users);
        handleUserList(response.data.users);
      });
    } else {
      setIsLableFiltering(false);
      console.log("userRefetch:", usersData);
      if (usersData.data) handleUserList(usersData.data)
      // if (!isFetching) handleUserList(usersData.data);
      // fetchUsers(adminId, userPage, rowsPerPage, filterData, selectedTags)
      // Handle the case when no tags are selected (e.g., show all users).
      // You can call your existing method here to fetch all users.
      // Example: getuserListMethod(spaceId, rowsPerPage, userPage);
      // UserService.getAllUsers(adminId, rowsPerPage, userPage).then((response) => {
      //   console.log("RESP | getAllUsers---", response);
      //   if (response) setRowCountState(response.data.total);
      //   setLoading(false);
      //   console.log("LIST---", response.data.users);
      //   handleUserList(response.data.users);
      // });
    }
};


  const [isActiveLabel, setActiveLabel] = useState(true);

  const toggleClassLabel = () => {
    setActiveLabel(!isActiveLabel);
  };
  const [labelOptions, setLabelOptions] = useState([
    {
      labelId: 1,
      label: 'Test 1',
      value: '#FFD700',
      labelDescription: "This is Gold"
    },
  ]);

  const [isFiltering, setIsFiltering] = useState(false);
  const [isLableFiltering, setIsLableFiltering] = useState(false);


  // Queries ------------------

  const { isSuccess: LabelStatus, isFetching, error, data: labelsData, refetch: labelRefetch } = useQuery({ queryKey: ['labels', (user.id)], queryFn: () => fetchLatestLabels(user.id), refetchOnWindowFocus: false }) // userService.UserLabelList(user.id) })
  const { isFetching: isUserFetching, error: usererror, data: usersData, refetch: userRefetch } = useQuery({ queryKey: ['users'], queryFn: () => fetchUsers(user.id, userPage, rowsPerPage, filterData, selectedTags), refetchOnWindowFocus: false }) // userService.UserLabelList(user.id) })


  // ----------------------------

  // ----------------------------------------------

  // desk
  // useEffect(async () => {
  //   if (!isFiltering && !isLableFiltering) {
  //     setLoading(true)
  //     getuserListMethod(spaceId, rowsPerPage, userPage)
  //   }
  // }, [userPage, rowsPerPage])

  // useEffect(() => {
  //   getlableListMethod(spaceId)
  // }, [])

  useEffect(() => {
    setLoading(true)

    if (!isUserFetching) {
      console.log("Fetching user list");
      setLoading(false)
      handleUserList(usersData.data)
    }

  }, [isUserFetching])




  useEffect(async () => {
    if (!isFetching) {
      const data = await labelsData.data.map(labels => {
        const { labelId } = labels
        const label = labels.title;
        const value = labels.colorHex;
        const labelDescription = labels.description;
        // console.log({ label, value, labelDescription });
        return { labelId, label, value, labelDescription }
      })

      setLabelOptions(data)
    }
  }, [isFetching])


  // ----------------------------------------------

  
  
  // ----------- DESK CODE -----------------------------------


  const getuserListMethod = (accountId, rowsPerPage, userPage) => {
    DeskUserService.getUserList(adminId, accountId, rowsPerPage, userPage).then((result) => {
      setRowCountState(result.data.total)
      if (result.data.total > 0) {
        setLoading(false)
        handleUserList(result.data.data)
      } else {
        setLoading(false)
        handleUserList(result.data.data)

      }
    })
  }

  const getlableListMethod = (accountId) => {
    DeskUserService.getLables(adminId, accountId).then(async (labelsData) => {

      const data = await labelsData.data.map(labels => {
        const { id } = labels
        const label = labels.title;
        const value = labels.color;
        const labelDescription = labels.description;
        // console.log({ label, value, labelDescription });
        return { labelId: parseInt(id, 10), label, value, labelDescription }
      })

      setLabelOptions(data)

    }).catch(error => { console.log("error labels:", error); })
  }

  // ----------- END DESK CODE -----------------------------------

  const deleteUser = useCallback(
    (id) => () => {
      const userId = id
      setTimeout(() => {
        UserService.UserDelete(userId, adminId).then((response) => {
          if (response.status)
            setUserList(
              (userList) => userList.filter((row) => row.user_id !== id));
        });
      })

    },
    [],
  );

  const toggleAdmin = React.useCallback(
    (id) => () => {
      setUserList((prevRows) =>
        prevRows.map((row) =>
          row.user_id === id ? { ...row, isAdmin: !row.isAdmin } : row,
        ),
      );
    },
    [],
  );

  const handleUser = React.useCallback(
    (params) => () => {
      console.log("ID", params.row)
      TokenService.setData("currentUser", params.row)
      // console.log("rowToDuplicate",rowToDuplicate)
      //   setUserList((prevRows) => {
      //     const rowToDuplicate = prevRows.find((user) => paramCase(user.user_id) === id);
      //     console.log("prevRows",prevRows,"rowToDuplicate",rowToDuplicate)
      //     // const rowToDuplicate = prevRows.find((row) => row.user_id === id);
      //     // return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      //   });
    },
    [],
  );

  const getCapData = (params) => {
    // console.log("params",JSON.parse(params.row.capturedData).map((C)=>{return `${C.value} |` }))
    const cdata = JSON.parse(params.row.capturedData).map((C) => { return `${C.value} |` })
    // console.log("C data", JSON.stringify(cdata))
    return JSON.stringify(cdata[0]);
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const GetCapData = (params) => {
    JSON.parse(params.row.capturedData).map((C) => {
      return `${(C.value)} `
    })
  }

  const TABLE_HEAD = React.useMemo(
    () => [
      { field: 'user_id', headerName: 'ID', valueGetter: userList.forEach((user, index) => { user.user_id = index + 1; }), width: 80 },
      { field: 'fullName', headerName: 'Full Name', width: 250 },
      { field: 'whatsapp_number', headerName: 'WhatsApp Number', width: 220 },
      { field: 'email', headerName: 'Email', width: 290 },
      { field: 'DateTime', headerName: 'Date', valueGetter: ({ value }) => value && (moment.utc(value).local().format('DD-MM-YYYY hh:mm A')), width: 250 },

      {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<FileCopyIcon />}
            label="View/ Edit User"
            component={RouterLink}
            to={`${PATH_DASHBOARD.user.root}/${params.row.user_id}/edit`}
            onClick={handleUser(params)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteUser(params.row.user_id)}
            showInMenu
          />
        ],
      },
    ],
    [deleteUser, handleUser],
  );

  const handleUserList = (details) => {
    setUserList(details)
  }

  // -------- Contact import

  const sendFileToServer = async (fileData, fileType) => {
    setImportLoading(true);
  
    try {
      // Construct the FormData object to send the file
      const formData = new FormData();
      // formData.append('file', fileData, `importedFile.${fileType}`);
      formData.append('file', new Blob([fileData], { type: 'text/plain' }), `importedFile.${fileType}`);
      // formData.append('file', fileData);
      formData.append('fileType', fileType);
      formData.append('adminId', adminId);
      // Make an HTTP POST request to send the file to the server
      const response = await UserService.ImportContacts(formData);
  
      // console.log("resp---", response.status, response.ack);

      
  
      // Parse and return the server's acknowledgment response
      const responseData = await response.data;
      return responseData;
    } finally {
      setImportLoading(false);
    }
  };
  
  

  const handleExcelFileChange = (event) => {
    const file = event.target.files[0];
    // console.log("Excel file", file);
    setExcelFile(file);
  };

  const handleCsvFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };


  const handleImportClose = () => {
    setImportOpen(false);
    setUploadProgress(0); // Reset progress when closing
  };

  const handleImportOpen = () => {
    setImportOpen(true);
  };

  const handleTabImportChange = (event, newValue) => {
    setSelectedImportTab(newValue);
  };

  const handleImportSubmit = async(file) => {
    // Handle the form submission here
    // You can differentiate between Excel and CSV based on selectedTab
    // Perform your upload logic
    // Close the dialog when done

    try {
      if (selectedImportTab === 0 && excelFile) {
        // Handle Excel Sheet upload logic
        console.log('Uploading Excel Sheet:', excelFile.name);
        // simulateUploadProgress();
  
        // Read and process the Excel file here
        // const fileData = await readFileAsync(excelFile);
  
        // Send the file data to the server
        const response = await sendFileToServer(excelFile, 'excel');
  
        console.log('Server Response:', response.ack);

        if (response) {

          // setUploadResponse((prev) => ({
          //   ...prev,
          //   ack: response.ack,
          //   status: true,
            
          // }));
          enqueueSnackbar(response?.ack)
          console.log(uploadResponse);
          if(response.status) {
            enqueueSnackbar(response?.ack)
            handleImportClose();
          }
        }
        
      } else if (selectedImportTab === 1 && csvFile) {
        // Handle CSV file upload logic
        console.log('Uploading CSV File:', csvFile.name);
        // simulateUploadProgress();
  
        // Read and process the CSV file here
        const fileData = await readFileAsync(csvFile);
  
        // Send the file data to the server
        const response = await sendFileToServer(fileData, 'csv');
  
        console.log('Server Response:', response);
        handleImportClose();
      } else {
        console.error('No file selected.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    setImportOpen(false);
  };

  // Simulate upload progress (replace with actual logic)
  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  // --------------

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
  };


  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = userList.map((n) => n.name);
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

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(value);
  };

  const handleChangePage = (newPage) => {
    // setPage(0);
    setUserPage(newPage);
  };

  // nc
  const onFilterChange = useCallback((filterModel) => {
    // Here you save the data you need from the filter model
    const phoneNumber = filterModel.quickFilterValues[0]
    const columnField = filterModel.items[0]?.columnField
    const operatorValue = filterModel.items[0]?.operatorValue
    const filterValue = filterModel.items[0]?.value
    const quickFilterLogicOperator = filterModel.items[0]?.quickFilterLogicOperator
    const quickFilterValues = filterModel?.quickFilterValues[0]

    filterData = { columnField, operatorValue, filterValue, quickFilterLogicOperator, quickFilterValues }

    DeskUserService.getFilterUserList(adminId, spaceId, rowsPerPage, userPage, phoneNumber).then((result) => {
      setRowCountState(result.data.total)
      if (result.data.total || phoneNumber) {
        setIsFiltering(true);
        // setUserPage(0)
        setLoading(false)
        handleUserList(result.data.users)
      } else {
        setIsFiltering(false);
        // getuserListMethod(spaceId, rowsPerPage, userPage)
      }
    })
    // setQueryOptions({ filterModel: { ...filterModel } });
  }, []);

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = (userId) => {
    const deleteUser = userList.filter((user) => user.id !== userId);
    setSelected([]);
    setUserList(deleteUser);
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = userList.filter((user) => !selected.includes(user.name));
    setSelected([]);
    setUserList(deleteUsers);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  // const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  // const isNotFound = !filteredUsers.length && Boolean(filterName);

  // console.log("labelOptions",labelOptions)

  // ---------------------------------------------------------------------------------

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>

        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <>
              {/* nr-changes */}
              <Divider orientation="left">Lables</Divider>
              <Space size={[0, 8]} wrap >
                <Box style={{ width: 700, overflowX: 'hidden', overflowY: 'auto' }}>
                  {/* {LabelStatus && labelOptions.length ? labelOptions.map((tag) => ( */}
                  {labelOptions.length ? labelOptions.map((tag) => (

                    <CheckableTag
                      key={tag.labelId}
                      style={{ borderColor: tag.value, borderRadius: '5px', borderWidth: 'initial' }}
                      checked={selectedTags.includes(tag.labelId)}
                      onChange={(checked) => handleChangeTags(tag.labelId, checked)}
                    >
                      {tag.label}
                    </CheckableTag>
                  )) : null}
                </Box>
              </Space>
              <Space size={[8, 8]} wrap direction="horizontal" >
              {/* <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.user.newUser}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Import Contact
              </Button> */}

              <Button variant="contained" onClick={handleImportOpen}>
                Import Contact
              </Button>
              <Dialog open={openImport} onClose={handleImportClose}>
                { !uploadResponse.length === 0 && ( <Alert severity={uploadResponse.status?"success":"warning"}>{uploadResponse.ack}</Alert>)}
                <DialogTitle>Import Contact</DialogTitle>
                <DialogContent>
                  <Tabs
                    value={selectedImportTab}
                    onChange={handleTabImportChange}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Excel Sheet" />
                    <Tab label="CSV File" />
                  </Tabs>
                  <Box p={2}>
                    {selectedImportTab === 0 && (
                      // Excel Sheet upload form
                      <div>
                        <Space direction="vertical" spacing={4}>
                        <Typography variant="subtitle1">Upload Excel Sheet</Typography>
                        <Button
                          variant="contained"
                          // color="#ffa726"
                          size="small"
                          startIcon={<GetAppIcon />}
                        >
                          Excel Sheet Sample
                        </Button>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleExcelFileChange}
                        />
                        </Space>
                      </div>
                    )}
                    {selectedImportTab === 1 && (
                      // CSV file upload form
                      <div>
                        <Space direction="vertical" spacing={4}>
                        <Typography variant="subtitle1">Upload CSV File</Typography>
                        <Button
                          variant="contained"
                          // color="#ffa726"
                          size="small"
                          startIcon={<GetAppIcon />}
                        >
                          CSV Sample
                        </Button>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleCsvFileChange}
                        />
                        </Space>
                      </div>
                    )}
                  </Box>
                  {/* Progress bar */}
                  {/* {uploadProgress > 0 && (
                    <Box p={2}>
                      <Typography variant="body2">Uploading...</Typography>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                  )} */}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleImportClose} color="primary">
                    Cancel
                  </Button>
                  <LoadingButton variant="outlined" loading={Importloading} onClick={handleImportSubmit}>
                    Submit
                  </LoadingButton>
                </DialogActions>
              </Dialog>

              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.user.newUser}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New User
              </Button>
              </Space>
              {/* </div> */}
            </>
          }
        />


        <Card>
          <Box sx={{ mt: 2 }} />
          <div style={{ height: 600, width: '100%' }}>

            {
              <DataGrid
                key={(row) => row?.user_id}
                rows={userList}
                columns={TABLE_HEAD}
                getRowId={(row) => row.user_id}
                loading={loading}
                pagination
                paginationMode="server"
                rowCount={rowCountState}
                rowsPerPageOptions={[10, 25, 50, 99]}
                onPageSizeChange={handleChangeRowsPerPage} // 50,100
                pageSize={rowsPerPage}
                onPageChange={handleChangePage} // 1
                page={userPage}  // 1
                filterMode="server"
                onFilterModelChange={onFilterChange}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500, InputProps: { placeholder: 'Search Number' }, },
                  },
                }}
              />
            }

          </div>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

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
    return array.filter((_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

async function fetchLatestLabels(userId) {
  const fetchedLabels = await UserService.UserLabelList(userId);
  TokenService.setData('labels', fetchedLabels.data);
  return fetchedLabels;
}


async function fetchUsers(adminId, page, rowsPerPage, filterData, selectedTags) {
  const fetchedusers = await UserService.UserList(adminId, page, rowsPerPage, filterData, selectedTags);
  return fetchedusers;

}

const readFileAsync = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target.result;
      resolve(result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};