import { sentenceCase, paramCase } from 'change-case';
import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Container,
  Box,
  Button as MuiButton,
} from '@mui/material';
// Mui-X
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
// Ant Design
import "antd/dist/antd.css";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Space, Table, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import { Excel } from "antd-table-saveas-excel";
// Moment
import * as moment from 'moment';
// react-query
import {
  useQuery,
  // useQueryClient,
} from '@tanstack/react-query'

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
import ReportService from '../../services/report.service';
import TokenService from '../../services/token.service';
import DeskUserService from '../../services/desk.user.service';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export default function MessageReport() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const [messageList, setMessageList] = useState([]);
  // const [loading, setLoading] = useState(false);

  const adminId = TokenService.getUser().userInfo.id;
  const spaceId = TokenService.getData("userDetails").space_id;
  const [messageInfo, setMessageInfo] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    loading: true,
    filters: '',
    sortField: 'messageId',
    sortOrder: 'ASC',
  });

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);


  // Queries ------------------

  // const {isSuccess: MsgStatus, isLoading:MsgReportLoading, error, data: MsgData, refetch: messageReportRefetech } = useQuery({ queryKey: ['messageReport', adminId, messageInfo.currentPage, messageInfo.pageSize, messageInfo.filters, messageInfo.sortField, messageInfo.sortOrder], queryFn: () => fetchMessageReport(adminId, messageInfo), refetchOnWindowFocus: false }) // userService.UserLabelList(user.id) })


  useEffect(() => {
    // getMessagesMethod(adminId, spaceId)
    getCrmMessageReports(adminId);
  }, [messageInfo.page, messageInfo.pageSize, messageInfo.sortOrder, messageInfo.filters])


  // useEffect(() => {
  //   // console.log("MsgReportLoading", MsgReportLoading);
  //   // console.log("msg data:",MsgData);
  //   // setLoading(true)
  //   setMessageInfo((prevState) => ({
  //     ...prevState,
  //     loading: true,
  //   }));

  //   if (!MsgReportLoading) {
  //     setMessageInfo((prevState) => ({
  //       ...prevState,
  //       loading: false,
  //     }));
  //     // setLoading(false)
  //   }
  //   if (MsgStatus) {
  //     // console.log("MsgData", MsgData);
  //     if (MsgData.status && MsgData.data.length) {
  //       setMessageInfo((prevState) => ({
  //         ...prevState,
  //         total: MsgData.total,
  //       }));
  //       handleMessageList(MsgData.data)
  //     }
  //   }

  //   setTimeout(() => {
  //     // setLoading(false)
  //     setMessageInfo((prevState) => ({
  //       ...prevState,
  //       loading: false,
  //     }));
  //   }, 5000);

  // }, [MsgStatus, MsgData])

  // useEffect(() => {
  //   console.log(messageInfo);
  //   messageReportRefetech(adminId, messageInfo)
  // }, [messageInfo.page])

  // const deleteUser = React.useCallback(
  //   (id) => () => {
  //     const userId = id
  //     setTimeout(() => {
  //       UserService.UserDelete(userId, adminId).then((response) => {
  //         if (response.status)
  //           setUserList(
  //             (userList) => userList.filter((row) => row.user_id !== id));
  //       });
  //     })

  //   },
  //   [],
  // );

  // const toggleAdmin = React.useCallback(
  //   (id) => () => {
  //     setUserList((prevRows) =>
  //       prevRows.map((row) =>
  //         row.user_id === id ? { ...row, isAdmin: !row.isAdmin } : row,
  //       ),
  //     );
  //   },
  //   [],
  // );

  const handleMessageList = (details) => {
    setMessageList(details)
  }

  // -------------------------------------------------------------

  const handleTableChange = (pagination, filters, sorter) => {
    // console.log("handleTableChange", pagination, filters, sorter);
    setMessageInfo((prevState) => ({
      ...prevState,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
      filters,
    }));

    // messageReportRefetech(adminId, messageInfo)
    // const {page, pageSize} = messageInfo;
    // messageInfo.page = messageInfo.page
  };

  const handlePageChange = (newPage) => {
    // setMessageInfo({...messageInfo.page,value})
    // setMessageInfo((prevState) => ({
    //   ...prevState,
    //   page: newPage,
    // }));
  };

  const handlePageSizeChange = (newPageSize) => {
    // setMessageInfo({...messageInfo.pageSize,value})
    // setMessageInfo((prevState) => ({
    //   ...prevState,
    //   pageSize: newPageSize,
    // }));
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {

    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Sr.No',
      dataIndex: 'messageId',
      key: 'messageId',
      width: '10%',
      sorter: (a, b) => a.messageId - b.messageId,
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend',
      render: (text, record, index) => `${index+1+messageInfo.page*messageInfo.pageSize-messageInfo.pageSize}`
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '20%',
      // ...getColumnSearchProps('fullName'),
    },
    {
      title: 'Phone',
      dataIndex: 'whatsapp_number',
      key: 'whatsapp_number',
      width: '20%',
      // ...getColumnSearchProps('phone_number'),
    },
    // {
    //   title: 'Message',
    //   dataIndex: 'message_content',
    //   key: 'message_content',
    //   width: '30%',
    //   // ...getColumnSearchProps('message_content'),
    // },
    {
      title: 'Message type',
      dataIndex: 'message_type',
      key: 'message_type',
      width: '30%',
      // ...getColumnSearchProps('message_type'),
    },
    {
      title: 'Status',
      dataIndex: 'message_delivery',
      key: 'message_delivery',
      width: '30%',
      render: (message_delivery) => {
        if (message_delivery === "1") {
          return <Tag color="green" key={message_delivery}>
            {"Sent"}
          </Tag>
        }
        return <Tag color="red" key={message_delivery}>
          {"Failed"}
        </Tag>
      },
      // ...getColumnSearchProps('message_type'),
    },
    //
    // {
    //   title: 'Type',
    //   dataIndex: 'content_type',
    //   key: 'content_type',
    //   width: '20%',
    //   // ...getColumnSearchProps('message_type'),
    //   filters: [
    //     {
    //       text: 'TEXT',
    //       value: 'Text',
    //     },
    //     {
    //       text: 'IMAGE',
    //       value: 'Image',
    //     },
    //     {
    //       text: 'VIDEO',
    //       value: 'Video',
    //     },
    //     {
    //       text: 'PDF',
    //       value: 'PDF',
    //     },
    //     {
    //       text: 'FILES',
    //       value: 'Application',
    //     },


    //   ],
    //   onFilter: (value, record) => record.message_type.includes(value),
    // },
    {
      title: 'Date',
      dataIndex: 'DateTime',
      key: 'DateTime',
      width: '20%',
      // ...getColumnSearchProps('created_at'),
      render: (DateTime) => {
        return moment(DateTime).format('Do MMM YY hh:mm:ss A')
    
      }
    },
    // {
    //   title: 'Age',
    //   dataIndex: 'age',
    //   key: 'age',
    //   width: '20%',
    //   ...getColumnSearchProps('age'),
    // },
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   key: 'address',
    //   ...getColumnSearchProps('address'),
    //   sorter: (a, b) => a.address.length - b.address.length,
    //   sortDirections: ['descend', 'ascend'],
    // },
  ];

  const getMessagesMethod = (adminId, accountId) => {

    DeskUserService.getMessages(adminId, accountId, messageInfo).then((data) => {
      data = data.data
      if (data.data.length > 0) {
        setMessageInfo((prevState) => ({
          ...prevState,
          loading: false,
          total: data.total,
        }));
        handleMessageList(data.data)
      } else {
        setMessageInfo((prevState) => ({
          ...prevState,
          loading: false,
          total: 0,
        }));

      }

    }).catch(error => {
      setMessageInfo((prevState) => ({
        ...prevState,
        loading: false,
      }));
    })

  }

  // here
  const getCrmMessageReports = async (adminId) => {
    // Get Message Report From crm db
    const messagereports = await fetchMessageReport(adminId, messageInfo)
    if (messagereports.status) {

      if (messagereports.data.length > 0) {
        setMessageInfo((prevState) => ({
          ...prevState,
          loading: false,
          total: messagereports.total,
        }));

        handleMessageList(messagereports.data);
      } else {
        setMessageInfo((prevState) => ({
          ...prevState,
          loading: false,
          total: 0,
        }));
      }

    } else {

      setMessageInfo((prevState) => ({
        ...prevState,
        loading: false,
      }));

    }


  }

  // export =>

  const Excelcolumns = [
    {
      title: 'ID',
      key: 'id',
      render: (text, record, index) => `${index + 1}`
    },
    {
      title: 'MessageId',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Message',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
    }
  ];

  const handleExportExcel = () => {
    const excel = new Excel();
    // console.log("excel", excel)
    const fexcel = excel
      .addSheet("Message Report")
      .addColumns(Excelcolumns)
      .addDataSource(messageList, {
        str2Percent: true
      })
      .saveAs("Message_Report.xlsx")
    // console.log("fexcel", fexcel)

  };

  // <= export

  // -------------------------------------------------------------

  // console.log("GLOBAL -------- messageInfo", messageInfo);

  return (
    <Page title="Message Report: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Message Report"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Report', href: PATH_DASHBOARD.report.root },
            { name: 'Message-List' },
          ]}
          action={
            <MuiButton
              variant="contained"
              onClick={handleExportExcel}
              // component={RouterLink}
              // to={PATH_DASHBOARD.user.newUser}
              startIcon={<Iconify icon={'file-icons:microsoft-excel'} />}
            >
              Export to Excel
            </MuiButton>
          }
        />
        <Card>
          {/* <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            // handleExcel = {exportToCSV(userList, 'USER_LIST', wscols)}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          /> */}
          <Box sx={{ mt: 2 }} />

          <Table
            size="small"
            columns={columns}
            dataSource={messageList}
            rowKey="messageId"

            loading={messageInfo.loading}
            pagination={{
              current: messageInfo.page,
              pageSize: messageInfo.pageSize,
              total: messageInfo.total,
              onChange: handlePageChange,
              showSizeChanger: true,
              onShowSizeChange: handlePageSizeChange,
            }}
            onChange={handleTableChange}

            // tableHeight = {500}
            scroll={{
              x: 700,
              y: 500,
            }}
          />
          {/* </div> */}


        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------


async function fetchMessageReport(adminId, messageInfo) {
  const defaultMessageInfo = {
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    filters: '',
    sortField: '',
    sortOrder: 'DESC',
  }
  const { page, pageSize, filters, sortField, sortOrder } = messageInfo || defaultMessageInfo;
  // console.log(messageInfo);
  const response = await ReportService.MessageReport(adminId, page, pageSize, filters, sortField || 'messageId', sortOrder || 'DESC');
  // console.log("Msg Report", response.data);
  return response;
}