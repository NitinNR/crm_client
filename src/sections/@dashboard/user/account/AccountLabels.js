import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// Ant Design
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import 'antd/dist/antd.css';

// 3rd party
import { Colorpicker, ColorPickerValue } from 'antd-colorpicker'

// react-query
import {
  useQuery,
  useMutation,
} from '@tanstack/react-query'

// hooks
import useAuth from '../../../../hooks/useAuth';

// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// API's
import userService from '../../../../services/user.service';
import TokenService from '../../../../services/token.service'

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

AccountLabels.propTypes = {
  myProfile: PropTypes.shape({
    facebookLink: PropTypes.string,
    instagramLink: PropTypes.string,
    linkedinLink: PropTypes.string,
    twitterLink: PropTypes.string,
  }),
};

export default function AccountLabels({ myProfile }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [labelObj, setLabelObj] = useState([])


  // Queries
  const {status: LabelStatus, error, data:labelsData, refetch: labelRefetch } = useQuery({ queryKey: ['labels', (user.id)], queryFn: () => fetchLatestLabels(user.id), refetchOnWindowFocus: false }) // userService.UserLabelList(user.id) })
  const { isSuccess: isSuccessLabels, isLoading: isUpdatingLabels, mutate:postLabelsData } = useMutation( (labelData) => UpdateLatestLabels(labelData) ); // userService.UserLabelList(user.id) })

  const initialValues = [
    { color: { r: 20, g: 14, b: 85, a: 1 }, title: "KET", description: "this is desc" },
    { color: "", title: "NR" },
    { color: "", title: "MH" },
  ]


  const defaultValues = {
    facebookLink: myProfile.facebookLink,
    instagramLink: myProfile.instagramLink,
    linkedinLink: myProfile.linkedinLink,
    twitterLink: myProfile.twitterLink,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const onFinish = async (values) => {
    // enqueueSnackbar('Updating labels!');
    console.log('Received values of form:', values, typeof(values));
    const result = compareLabelsObject(TokenService.getData('labels'), values.labels);
    // setLabelObj(result)
    // const compareRes = compareArrays(result, labelObj)
    // TokenService.setData('labels', values.labels)
    console.log("result", result);
    const LabelDataRaw = {adminId: user.id, LabelData: result }

    
    // Send result to Server


    postLabelsData(LabelDataRaw)
    labelRefetch();
    // window.location.reload(false)
  };

  // useEffect(() => {
  //   if (data) {
  //     form.setFieldsValue({
  //       fields: data.map(fieldData => {
  //         return {
  //           field1: fieldData.field1,
  //           field2: fieldData.field2,
  //           // ...
  //         }
  //       })
  //     });
  //   }
  // }, [data]);

useEffect(() => {


  if (isSuccessLabels) {
    // await new Promise((resolve) => setTimeout(resolve, 500));
    enqueueSnackbar('Labels Updated Successfully!');
  }

}, [isSuccessLabels])

useEffect(() => {


  if (LabelStatus==='success') {
    form.setFieldsValue({
      labels: labelsData.data || []
    });
  }

}, [LabelStatus])

// console.log("isUpdatingLabels", isUpdatingLabels);

  return (
    <Card sx={{ p: 3 }}>
      {/* -------------------- Label Management ------------------------ */}

      <Form name="label_manage" onFinish={onFinish} autoComplete="off" form={form} >
      <Form.List name="labels" >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              
              <Space
                key={[name, 'labelId']}
                style={{
                  display: 'flex',
                  marginBottom: 8,
                  marginLeft:8
                }}
                align="baseline"
              >
                <Form.Item name={[name, `color`]} {...restField}>
                  <Colorpicker title={'Label color'} popup popoverProps={{placement:"right"}} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'title']}
                  rules={[
                    {
                      required: true,
                      message: 'Missing label title',
                    },
                  ]}
                >
                  <Input placeholder="Label title" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                  rules={[
                    {
                      
                      message: 'Missing description',
                    },
                  ]}
                >
                  <Input placeholder="Description (optional)" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Label
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
      </LoadingButton>
      </Form>


    </Card>
  );
}

async function fetchLatestLabels (userId) {
  const fetchedLabels = await userService.UserLabelList(userId);
  console.log("LABELS", fetchedLabels.data);
  TokenService.setData('labels', fetchedLabels.data);
  return fetchedLabels;
}

async function UpdateLatestLabels (labelData) {
  console.log("UpdateLatestLabels", labelData);
  const fetchedLabels = await userService.UserLabelUpdate(labelData);
  console.log("LABELS", fetchedLabels.data);
  // TokenService.setData('labels', fetchedLabels.data);
  return fetchedLabels;
}


function compareLabelsObject (initialValues, updatedValues) {
  const result = [];

  const defaultValues ={ color: {hex:"#ffffff",rgb: {
    "r": 255,
    "g": 255,
    "b": 255,
    "a": 1
  }},
  description: ''
  }


  updatedValues.forEach((obj2) => {
    const obj1 = initialValues.find((o) => o.labelId === obj2.labelId);
    if (!obj1) {
      // console.log("OBJ@2",obj2.color)
      if(!obj2.color) { obj2.color = defaultValues.color
      
      }if (!obj2.description) { obj2.description="" }
      result.push({ INSERT: obj2 }); // INSERT
    } else {
      Object.keys(obj2).forEach((key) => {
        if (obj2[key] !== obj1[key]) {
          if (!obj2.description) { obj2.description="" }
          result.push({ UPDATE: obj2 });
          // return;
        }
      });
    }
  });

  initialValues
    .filter((obj1) => !updatedValues.find((o) => o.labelId === obj1.labelId))
    .forEach((obj) => result.push({ DELETE: obj }));

  return result;
};

function unStringifyObj (Data) {
  const LabelData = Data.map(item => {
  const [key, value] = Object.entries(item);
  return {
      [key]: value
  }
});
return LabelData
}


function compareArrays(arr1, arr2) {
  if (JSON.stringify(arr1) === JSON.stringify(arr2)) {
    return 0;
  }
  return -1;

}
