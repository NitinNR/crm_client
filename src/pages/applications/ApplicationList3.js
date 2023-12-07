import { sentenceCase, paramCase } from 'change-case';
import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  // Card,
  Button as Mbutton,
  Container,
  Typography,
  TableContainer,
  Box,
  OutlinedInput,
  Chip,
  InputLabel,
  FormControl,
  MenuItem,
} from '@mui/material';
// Mui-X
import { DataGrid, 
} from '@mui/x-data-grid';

// Ant design
import { Button, message, Steps, Card, Space, Row, Col, Avatar, Typography as AntTypography, Form, Alert, Input } from 'antd';
import 'antd/dist/antd.css';
import { 
  SolutionOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
// Moment
import * as moment  from 'moment';
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
import TokenService from '../../services/token.service';

import ApplicationSelect from './ApplicationSelect'
import ApplicationForm from './ApplicationForm';

// ----------------------------------------------------------------------

const { Title, Paragraph } = AntTypography;


// ----------------------------------------------------------------------

export default function ApplicationList() {
  const theme = useTheme();
  const { user } = useAuth();
  const { themeStretch } = useSettings();

  // Access the client
  // const queryClient = useQueryClient()

  const adminId = TokenService.getUser().userInfo.id;
  const [current, setCurrent] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedFormFields, setSelectedFormFields] = useState([]);
  const [alert, setAlert] = useState(false)
  const [form] = Form.useForm();

  // objs ----------

  const avatarData = [
    {
      name: 'lifeelspace',
      label: 'LifeelSpace',
      icon: 'L',
    },
    {
      name: 'dialogflow',
      label: 'Dialogflow',
      icon: 'D',
    },
    {
      name: 'google_sheet',
      label: 'Google Sheet',
      icon: 'GS',
    },
  ];

  const formFields = [
    { channelName: "lifeelspace", AccountID: "Account Id", ApiKey: "API KEY", url: "Panel URL" },
    { channelName: "dialogflow", projectId: "Project Id", JsonKey: "JSON KEY" },
    { channelName: "google_sheet", projectId: "Project Id", JsonKey: "JSON KEY" },
    // { channelName: "dialogflow", projectId: "project Id", credentials: "credentials" },
    ];
  
  
  // ---------------

  // state func --------

  const handleChooseApp = (AppName) => {
    setSelectedAvatar(AppName);
    setSelectedFormFields(()=>{
      return formFields.find((item) => item.channelName === AppName);
    })
    console.log("selectedFields", selectedFormFields);
  };

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const borderColor = (avatarName) =>  selectedAvatar === avatarName ? '#1890ff' : '#ccc';

  const onFinish = (values) => {
    console.log('Form values:', values);
    setAlert(true)
    setTimeout(() => {
        setAlert(false)
    }, 3000);
  };

  const renderFormItems = () => {

    if (!Array.isArray(selectedFormFields)) {
      return null; // or any other default value or behavior
    }

    console.log("selectedFormFields", selectedFormFields);

    return selectedFormFields?.map(({ channelName, ...rest }) => (
      <React.Fragment key={channelName}>
        <h3>{channelName}</h3>
        {Object.entries(rest).map(([key, label]) => (
          <Form.Item
            key={key}
            name={key}
            label={label}
            rules={[{ required: true, message: `Please enter ${label}` }]}
          >
            <Input />
          </Form.Item>
        ))}
      </React.Fragment>
    ));
  };

  const MemoizedFormItems = React.memo(() => renderFormItems(selectedAvatar), [selectedAvatar]);


  const AppCard = ({ name, label, icon, onClick }) => (
    <Col xs={12} sm={12} md={8} lg={6} xl={6}>
      <Card
        hoverable
        style={{
          borderColor: borderColor(name),
          cursor: 'pointer',
          borderRadius: 4,
        }}
        onClick={() => onClick(name)}
      >
        <Avatar size={64} icon={icon} />
        {label}
      </Card>
    </Col>
  );
  
  const FormContent = ({ form, onFinish, alert, selectedFormFields }) => 
  {
    let renderedForm = selectedFormFields
    useEffect(() => {
      renderedForm = renderFormItems(selectedFormFields)
    }, [selectedFormFields.length])
    
  
  return (
    
    <Form form={form} onFinish={onFinish}>
      {alert ? <VerificationAlert /> : null}
      {renderedForm}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit and verify
        </Button>
      </Form.Item>
    </Form>
  );

  }
  
  const VerificationAlert = () => (
    <Alert message="Verified Successfully, click next" type="success" />
  );

  const LastStepContent = () => <div>Last-content</div>;


  const ChannelSteps = [
    {
      content: (
        <div>
          <Paragraph style={{ marginBottom: 30, fontSize: 16 }}>
            CRM supports LifeelSpace App currently. To get started, choose one of the apps below:
          </Paragraph>
          <Row gutter={[8, 8]}>
            {avatarData.map(({ name, label, icon }) => (
              <AppCard
                key={name}
                name={name}
                label={label}
                icon={icon}
                onClick={handleChooseApp}
              />
            ))}
          </Row>
        </div>
      ),
    },
    {
      title: 'Second',
      content: <FormContent form={form} onFinish={onFinish} alert={alert} selectedFormFields={selectedFormFields} />,
    },
    {
      title: 'Last',
      content: <LastStepContent />,
    },
  ];
  
  const items = ChannelSteps.map((item) => ({
    key: item.title,
    title: item.title,
    description: "this is description"
  }));
  

  const contentStyle = {
    // lineHeight: '260px',
    // textAlign: 'center',
    // color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    // borderRadius: token.borderRadiusLG,
    border: `1px grey`, // ${token.colorBorder}`,
    // marginTop: 16,
  };

  


  

  // -------------------

  useEffect(() => {
    console.log("selectedAvatar useEFFEC", selectedAvatar)
    if(selectedAvatar){
      setSelectedFormFields(()=>{
        return formFields.find((item) => item.channelName === AppName);
      })
    }
  }, [selectedAvatar.length, selectedFormFields.length])
  

  // Queries ------------------

  // const {isSuccess: LabelStatus, error, data:labelsData, refetch: labelRefetch } = useQuery({ queryKey: ['labels', (user.id)], queryFn: () => fetchLatestLabels(user.id), refetchOnWindowFocus: false }) // userService.UserLabelList(user.id) })


  // ----------------------------

  // ----------------------------------------------

  console.log("selectedFormFields:::", selectedFormFields);


  // ---------------------------------------------------------------------------------

  return (
    <Page title="Channel: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Channel List" />
  
        <Steps current={current} items={items} />
        <div style={contentStyle}>{ChannelSteps[current].content}</div>
  
        <div style={{ marginTop: 24 }}>
          {current < ChannelSteps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {current === ChannelSteps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={prev}>
              Previous
            </Button>
          )}
        </div>
      </Container>
    </Page>
  );
  
}

// ----------------------------------------------------------------------
