import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStepsForm } from 'sunflower-antd';
import { useSnackbar } from 'notistack';
import { Steps, Input, Col, Card, Avatar, Button, Form, Result, Typography, Row, Select } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { Container } from '@mui/material';
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
import Page from '../../components/Page';
import ChannelApi from "../../services/channel.service";

const { Step } = Steps;
const { Title, Paragraph } = Typography;
const { Option } = Select;


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const activeChannels = ["whatsapp", "sms"];

const formFields2 = [
  { channelName: "lifeelspace", Name: "Integration Name.", AccountID: "Account Id", ApiKey: "API KEY", url: "Panel URL" },
];

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

export default function ChannelList({ appMockups, formFields, ApplicationService }) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    form,
    current,
    gotoStep,
    stepsProps,
    formProps,
    submit,
    formLoading,
  } = useStepsForm({
    async submit(values) {
      
      console.log("values", values);
      const response = await ChannelApi.addChannel(adminId, selectedAvatar, values)
      const { status, ack } = response;
      console.info("response", response)
      if (response) {
        setAlertData({ status, ack });
        if (!status) {
          enqueueSnackbar(ack, { variant: 'error' });
          return false;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return 'ok';
      }
      // const response = await ApplicationService.AddApp(adminId, selectedAvatar, values, values.Name);
      // const { status, ack } = response;
      // if (response) {
      //   setAlertData({ status, ack });
      //   if (!status) {
      //     enqueueSnackbar(ack, { variant: 'error' });
      //     return false;
      //   }
      //   await new Promise((resolve) => setTimeout(resolve, 5000));
      //   return 'ok';
      // }
    },
    total: 3,
    stepsProps: { type: "navigation", size: "small" },
  });

  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const adminId = user?.id;

  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedFormFields, setSelectedFormFields] = useState([]);
  const [alertData, setAlertData] = useState({ status: false, ack: 'something went wrong, try again later' });
  const avatarData = appMockups;

  const handleChooseApp = (AppName) => {
    // console.log("AppName", AppName);
    setSelectedAvatar(AppName);
    const selectItem = formFields.find((item) => item.channelName === AppName);
    // console.log("selectItem", selectItem);
    setSelectedFormFields(selectItem);
  };

  const AppCard = ({ name, label, icon, onClick, enabled }) => (
    <Col>
      <Card
        hoverable
        style={{
          opacity: enabled ? 1 : 0.6,
          pointerEvents: enabled ? 'auto' : 'none',
          borderColor: borderColor(name),
          color: name === 'lifeelspace' ? 'black' : 'grey',
          cursor: enabled ? 'pointer' : 'default',
          borderRadius: 4,
          minHeight: '100px',
          minWidth: '150px',
          padding: '10px',
        }}
        onClick={() => enabled && onClick(name)}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90px' }}>
          <Avatar size={90} src={icon} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '16px', fontWeight: 'bold' }}>{label}</div>
      </Card>
    </Col>
  );

  const renderFormItems = () => {
    const selectItem = formFields.find((item) => item.channelName === selectedAvatar);
    if (selectItem) {
      const { channelName, title, description, ...rest } = selectItem;
      // console.log("rest", rest);
      // Object.entries(rest).map(([key, field])=>{
      //   return console.log("--", key, field);
      // })
      return (
        <React.Fragment key={channelName}>
          <h3>{title}</h3>
          <h4>{description}</h4>
          {Object.entries(rest).map(([key, field]) => (
            <Form.Item
              key={key}
              name={key}
              label={Array.isArray(field)?key:field}
              rules={[
                  {
                    required: field || false, // Add a "required" validation if the field specifies it
                    message: `Please enter ${field}`,
                  },
                  {
                    validator: (rule, field) => {
                      console.log("rule, field",rule, field);
                      if (key === 'phoneNumber' && !isValidPhoneNumber(field)) {
                        return Promise.reject(new Error('Please enter a valid phone number'));
                      }
                      if (key === 'email' && !isEmail(field)) {
                        return Promise.reject(new Error('Please enter a valid email address'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
              {Array.isArray(field) ? ( // Check if the field contains options (an array)
                <Select placeholder={`Select ${key}`}>
                  {field.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Input placeholder={`Enter ${field}`} />
              )}
            </Form.Item>
          ))}
        </React.Fragment>
      );
    }
    return null; // Return null if selectItem is not found
  };
  
  
  

  const borderColor = (avatarName) => (selectedAvatar === avatarName) ? '#1890ff' : '#ccc';

  const formList = [
    <>
      <div>
        <Paragraph style={{ marginBottom: 30, fontSize: 16 }}>Choose the provider you want to integrate with CRM</Paragraph>
        <Row gutter={[8, 8]}>
          {avatarData.map(({ app, displayName, photoURL, enabled }) => (
            <AppCard key={app} name={app} label={displayName} enabled={enabled} icon={photoURL} onClick={handleChooseApp} />
          ))}
        </Row>
      </div>
      {selectedAvatar && activeChannels.includes(selectedAvatar) && (
        <Button style={{ marginTop: 6 }} type="primary" onClick={() => gotoStep(current + 1)}>
          Next
        </Button>
      )}
    </>,

      // In the return statement where the formList is defined
      <>
{selectedAvatar && activeChannels.includes(selectedAvatar) && (
  <>
    {renderFormItems()}
    <Form.Item {...tailLayout}>
      <Button
        style={{ marginRight: 10 }}
        type="primary"
        loading={formLoading}
        onClick={() => {
          submit().then((result) => {
            if (result === 'ok') {
              gotoStep(current + 1);
            }
          });
        }}
      >
        Submit
      </Button>
      <Button onClick={() => { navigate('/dashboard/channels', { replace: true });form.resetFields(); }}>Prev</Button>
    </Form.Item>
  </>
)}
</>
  ];

  return (
    <Page title="Channels: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <div style={{ margin: 20 }}>
          <Steps {...stepsProps} current={current}>
            <Step title="Choose Channel" />
            <Step title="Enter Channel Details and verify" />
            <Step title="SUBMIT" />
          </Steps>
          <div style={{ marginTop: 60 }}>
            <Form {...layout} {...formProps} style={{ maxWidth: 600 }}>
              {formList[current]}
            </Form>
            {current === 2 && (
              <Result
                status={alertData.status ? "success" : "success"}
                title={alertData.ack}
                extra={
                  <>
                    <Button
                      type="primary"
                      onClick={() => {
                        form.resetFields();
                        gotoStep(0);
                        
                      }}
                    >
                      Add another Channel
                    </Button>
                    <Button onClick={() => {
                      navigate('/dashboard/channels', { replace: true });
                    }}>Done</Button>
                  </>
                }
              />
            )}
          </div>
        </div>
      </Container>
    </Page>
  );
};

function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^(?:\+\d{1,3}[- ]?)?(?:\d{10,12}|[(]\d{1,4}[)])$/;
  return phoneRegex.test(phoneNumber);
}

function isEmail(mail) {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
  return emailRegex.test(mail);
}

function channelVerification(formFields, selectedAvatar, values) {
  const selectItem = formFields.find((item) => item.channelName === selectedAvatar);
  
  const { title }  = selectItem;
  const statusInfo = { status:200, ack:`${title} verification failed, Try Again later` };

  if (selectedAvatar === "") {
    const { ApiProvider, ApiKey, businessAccID, phoneNumber, phoneNumberID } = values;
    
  }
}
