import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 3rd Party
import { useStepsForm } from 'sunflower-antd'
import { useSnackbar } from 'notistack';

// antD
import { Steps, Input, Col, Card, Avatar, Button, Form, Result, Typography, Row, } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import 'antd/dist/antd.css';
// mui
import {
  Container,
} from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
// import ApplicationList from './ApplicationList3';

// services


const { Step } = Steps;
const { Title, Paragraph } = Typography;



const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },



};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const avatarData2 = [
  {
    name: 'lifeelspace',
    label: 'LifeelSpace',
    icon: 'L',
  },
  {
    name: 'dialogflow',
    label: 'Dialogflow ',
    icon: 'D',
  },
  {
    name: 'google_sheet',
    label: 'Google Sheet',
    icon: 'GS',
  },
];

const formFields2 = [
  { channelName: "lifeelspace", Name: "Integration Name.", AccountID: "Account Id", ApiKey: "API KEY", url: "Panel URL" },
  // { channelName: "dialogflow", projectId: "Project Id", JsonKey: "JSON KEY" },
  // { channelName: "google_sheet", projectId: "Project Id", JsonKey: "JSON KEY" },
  // { channelName: "dialogflow", projectId: "project Id", credentials: "credentials" },
];

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});



export default function ApplicationList({ appMockups, formFields, ApplicationService }) {

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
      // const { AccountID, ApiKey, url } = values;
      const response = await ApplicationService.AddApp(adminId, selectedAvatar, values, values.Name)
      const { status, ack } = response
      if (response) {
        setAlertData({ status, ack });
        if (!status) {
          enqueueSnackbar(ack, { variant: 'error' })
          return false;
        }
        await new Promise(r => setTimeout(r, 5000));
        return 'ok';
      }

    },
    total: 3,
    stepsProps: { type: "navigation", size: "small" },
  });





  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const adminId = user?.id
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedFormFields, setSelectedFormFields] = useState([]);
  const [alertData, setAlertData] = useState({ status: false, ack: 'something went wrong try again later' })
  const avatarData = appMockups;

  // const [appAvailable, setAppAvailable] = useState(true)

  const handleChooseApp = (AppName) => {
    setSelectedAvatar(AppName);
    const selectItem = formFields.find((item) => item.channelName === AppName)
    setSelectedFormFields(() => {
      return formFields.find((item) => item.channelName === AppName);
    })
    // console.log("selectedFields", selectedFormFields);
    // return renderFormItems(selectItem)
  };

  const AppCard = ({ name, label, icon, onClick, enabled }) => (
    <Col xs={12} sm={12} md={8} lg={6} xl={6}>
      <Card
        // hoverable={true}
        hoverable
        style={{
          opacity: enabled ? 1 : 0.6, pointerEvents: enabled ? '' : 'none',
          borderColor: borderColor(name),
          color: (name === 'lifeelspace') ? 'black' : 'grey',
          cursor: 'pointer',
          borderRadius: 4,
        }}
        onClick={() => onClick(name)}
      >
        <Avatar size={64} src={icon} />
        {label}
      </Card>
    </Col>
  );

  const renderFormItems = (selectedAvatar) => {
    // console.log("selectedAvatar ::::", formFields)
    const selectItem = formFields
    // const selectItem = selectedAvatar.length>1?formFields.find((item) => item.channelName === selectedAvatar):formFields[0]
    // console.log("selectItem kkkk ::::", selectItem)
    // const selectItem = selectedAvatar

    // console.log("selectedFormFields renderFormItems---", selectedFormFields);

    // if (!(selectItem.length)) {
    //   return null; // or any other default value or behavior
    // }

    if (selectItem.length) {

      // console.log("selectedFormFields renderFormItems---", selectItem);
      return selectItem.map(({ channelName, ...rest }) => (
        <React.Fragment key={channelName}>
          <h3>{channelName}</h3>
          {Object.entries(rest).map(([key, label]) => (
            <Form.Item
              key={key}
              name={key}
              label={label}
            // rules={[{ required: true, message: `Please enter ${label}` }]}
            >
              <Input />
            </Form.Item>
          ))}
        </React.Fragment>
      ));
    }
  };


  // const borderColor = (avatarName) =>  selectedAvatar === avatarName ? '#1890ff' : '#ccc';
  const borderColor = (avatarName) => (selectedAvatar === avatarName && selectedAvatar === 'lifeelspace') ? '#1890ff' : '#ccc';
  const CardColor = (avatarName) => (selectedAvatar === avatarName && selectedAvatar === 'lifeelspace') ? 'black' : 'grey';

  // const [formList, setFormList] = useState([
  const formList = [
    <>
      <div>
        <Paragraph style={{ marginBottom: 30, fontSize: 16 }}>
          CRM supports LifeelSpace App currently. To get started, choose one of the apps below:
        </Paragraph>
        <Row gutter={[8, 8]}>
          {avatarData.map(({ app, displayName, photoURL, enabled }) => (
            <AppCard
              key={app}
              name={app}
              label={displayName}
              enabled={enabled}
              icon={photoURL}
              onClick={handleChooseApp}
            />
          ))}
        </Row>
      </div>
      {/* <Form.Item {...tailLayout}> */}
      {(selectedAvatar === "lifeelspace") && (<Button style={{ marginTop: 6 }} type="primary" onClick={() => gotoStep(current + 1)}>Next</Button>)}
      {/* </Form.Item> */}
    </>,

    <>
      {
        // <FormContent form={form} alert={alert} selectedFormFields={selectedFormFields} />
        renderFormItems(formFields)
      }
      <Form.Item {...tailLayout}>
        <Button
          style={{ marginRight: 10 }}
          type="primary"
          loading={formLoading}
          onClick={() => {
            submit().then(result => {
              if (result === 'ok') {
                gotoStep(current + 1);
              }
            });
          }}
        >
          Submit
        </Button>
        <Button onClick={() => { gotoStep(0) }}>Prev</Button>
      </Form.Item>
    </>,
  ];

  // useEffect(async() => {
  //   const temp = await selectedAvatar?renderFormItems(selectedAvatar):null
  //   console.log("useeffect Avatar", selectedAvatar, temp);

  //   // setFormList()
  //   // setSelectedFormFields(()=>{
  //   //   return formFields.find((item) => item.channelName === selectedAvatar);
  //   // })
  // }, [selectedAvatar.length, selectedFormFields?.length])

  // console.log("ADMIN iiD", adminId);

  return (
    <Page title="Applications: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <div style={{ margin: 20 }}>
          <Steps {...stepsProps}>
            <Step title="Choose App" />
            <Step title="Enter App Details and verify" />
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
                      Add another App
                    </Button>
                    <Button onClick={() => {
                      navigate('/dashboard/app', { replace: true })
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