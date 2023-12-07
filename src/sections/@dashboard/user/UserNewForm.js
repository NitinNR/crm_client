import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
import * as moment from 'moment';
// Ant design
import { Select, Tag } from 'antd';
import 'antd/dist/antd.css';
import { CaretDownOutlined, FormOutlined } from "@ant-design/icons";
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
// Services
import UserService from '../../../services/user.service'
import TokenService from '../../../services/token.service'


// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const toggleClassLabel = () => {
    setActiveLabel(!isActiveLabel);
  };


  const { Option } = Select;

  const adminId = TokenService.getUser()?.userInfo.id


  const NewUserSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    whatsappNumber: Yup.string().required('WhatsApp number is required'),
    DateTime: Yup.string(),
    displayName: Yup.string(),
    capturedData: Yup.string(),
    privateNote: Yup.string(),
    avatarUrl: Yup.mixed(), // .test('required', 'Avatar is required', (value) => value !== ''),
    additional_attributes: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
      whatsappNumber: currentUser?.whatsapp_number || '',
      DateTime: currentUser?.DateTime || '',
      displayName: currentUser?.displayName || '',
      capturedData: currentUser?.capturedData ? JSON.parse(currentUser.capturedData) : [] || [],
      privateNote: currentUser?.privateNote || '',
      avatarUrl: currentUser?.avatarUrl || '',
      additional_attributes: currentUser?.additional_attributes || '{}',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [labelOptions, setLabelOptions] = useState([]);



  const [defaultValuesSelect, setDefaultValuesSelect] = useState([]) // Default values of labeles-- only labelName 

  const [labelOptionsDefault, setLabelOptionsDefault] = useState([])

  const [updatedSelect, setUpdatedSelect] = useState([]) // updated values of labels with latest labelsData

  const [capturedata, setCapturedata] = useState(defaultValues.capturedData) // captured Data

  const [isActiveLabel, setActiveLabel] = useState(true);



  useEffect(() => {
    console.log(currentUser);
    if (isEdit && currentUser) {
      setCapturedata(defaultValues.capturedData)
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser]);


  useEffect(() => {
    UserService.UserLabelList(adminId).then((userlabels) => {

      if (userlabels.status) {
        const labels = [];
        userlabels.data.map(item => {
          labels.push({
            "labelId": item.labelId,
            "label": item.title,
            "value": item.colorHex,
            "colorData": item.color
          })
          return 0
        });
        setLabelOptions(labels);


      }
    })
    UserService.UserLabel(adminId).then((userLabelsData) => {
      const filteredData = userLabelsData.data.filter(item => item.userId !== null && item.userId === currentUser.user_id);
      setDefaultValuesSelect(filteredData);
    })
  }, [labelOptions.length])



  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();  
      if (isEdit) {
        const labelData = {
          data: labelOptionsDefault,
          userId: currentUser.user_id,
          adminId
        };
        if (labelOptionsDefault.length >= 0) {
          const user_label_update_status = await UserService.editUserLabelUpdate(labelData)
          if (user_label_update_status.status) {
            UserService.UserUpdate(currentUser.user_id, currentUser.adminId, values.fullName, values.displayName, values.email, values.whatsappNumber, values.privateNote, JSON.stringify(values.capturedData), values.avatarUrl)
              .then((response) => {
                if (response.status) { enqueueSnackbar('Update success!'); }
                else { enqueueSnackbar(response.ack) }
              })
          } else {
            enqueueSnackbar('Update Failed!');
          }
        }

      } else if (!isEdit) {
        UserService.UserCreate(adminId, values.fullName, values.displayName, values.email, values.whatsappNumber, values.privateNote, values.avatarUrl).then((response) => {
          if (response.status) {
            enqueueSnackbar('Create success!')
            navigate(PATH_DASHBOARD.user.list);

          }
        })
      }
      // enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // window.reload()
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectChange = (selectValue) => {
    console.log(selectValue)
    const selectedLabels = labelOptions.filter((option) => selectValue.includes(option.value));

    console.log("selectedLabels:", selectedLabels);

    setLabelOptionsDefault(selectedLabels);
    setDefaultValuesSelect(selectedLabels)
    // setLabelOptions(selectedLabels);

  };

  const onRemove = (data) => {
    console.log("Removed :", data);
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleCapturedData = (e) => {
    // console.log("CAP E",e.target,"capturedata",capturedata)
    capturedata.forEach((capData) => {
      if (e.target.name === capData.field) {
        capData.value = e.target.value
      }
    })
    // console.log("UPDATED",capturedata)
    setValue('capturedData', capturedata)
    setCapturedata(capturedata)

  }

  const onTagRemove = (tag) => {
    // const selectedLabels = labelOptions.filter((option) => {
    //   console.log(option, tag)
    //   if (option.value !== tag) return option;
    //   return option
    // });
    // setDefaultValuesSelect(selectedLabels)
  }

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        // color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        onChange={onTagRemove}
        key={label}
        style={{
          marginRight: 3,
          borderColor: value,
          borderRadius: '5px',
          borderWidth: 'initial'
        }}
      >
        {label}
      </Tag>
    );
  };

  const builder = (individualConfig, i) => {
    // console.log("individualConfig",individualConfig)
    switch (individualConfig.type) {
      case 'text':
        return (
          <RHFTextField key={i} defaultValue={individualConfig.value} name={individualConfig.field} label={individualConfig.label} onChange={(e) => { handleCapturedData(e) }} />
        );
      case 'number':
        return (

          <RHFTextField key={i} defaultValue={individualConfig.value} name={individualConfig.field} label={individualConfig.label} type='number' onChange={(e) => { handleCapturedData(e) }} />

        )
      default:
        return <div key={i}>Unsupported field</div>
    }
  }

  // console.log("defaultValuesSelect",  (capturedata ));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {/* <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            defaultValue={['gold', 'cyan']}
            style={{
              position: 'absolute', top: 44, left: 20
            }}
            options={labelOptions}
            bordered={false}
            // suffixIcon={<CaretDownOutlined />}
            suffixIcon={<FormOutlined className={isActiveLabel ? 'ant-select-suffix' : ''} onClick={toggleClassLabel} />}
          /> */}
            {isEdit && (
              <Label
                // color={values.status !== 'active' ? 'error' : 'success'}
                color={'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 20, right: 24 }}
              >
                {/* {values.status} */}
                {'ACTIVE'}
              </Label>
            )}
            {/* ToDo: Photo Upload */}
            <Box sx={{ mb: 5, mt: 4 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />

            </Box>
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              onChange={handleSelectChange}
              onDeselect={onRemove}
              value={defaultValuesSelect.map(tag => tag.value)}
              style={{
                position: 'absolute', top: 44, left: 20, opacity: 0.5, width: '90%',
              }}
              bordered={false}
              // suffixIcon={<CaretDownOutlined />}
              suffixIcon={<FormOutlined className={isActiveLabel ? 'ant-select-suffix' : ''} onClick={toggleClassLabel} />}
            >
              {labelOptions && labelOptions.map((option) => (
                <Option key={option.value} label={option.label} value={option.value} style={{ color: option.value }}>
                  {option.label}
                </Option>
              ))}
            </Select>
            {/* ToDo: Active/Banned Status */}
            {/* {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )} */}

            {/* <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="fullName" label="Full Name" />
              <RHFTextField name="displayName" label="Display Name/ username" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="whatsappNumber" label="WhatsApp Number" />

              {/* <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect> */}

              {isEdit ? <RHFTextField name="DateTime" label="Date Time" InputProps={{ readOnly: true, }} value={moment.utc(values.DateTime).local().format('DD-MM-YYYY hh:mm A')} /> : null}
              {/* ToDo : Create User with defaultValue = current Date + DateTIme Picker */}
              <RHFTextField name="privateNote" label="Private Note" />
            </Box>

            <Box
              mt={4}
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {isEdit && capturedata ? <Typography variant="h6" align="justify">
                Captured Data
              </Typography> : null}
            </Box>

            <Box
              mt={3}
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {/* ToDO: Captured Dat for New User */}
              {isEdit && capturedata ?
                (capturedata).map((c, i) => { return builder(c, i) })
                : null
              }
              {/* <RHFTextField name="capturedData" label="Captured Data" /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              {isEdit ? <LoadingButton type="submit" variant="contained" loading={isSubmitting} onClick={onSubmit} >
                {'Save Changes'}
              </LoadingButton> :
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} onClick={onSubmit}>
                  {!isEdit ? 'Create User' : 'Save Changes'}
                </LoadingButton>
              }
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}


// function compareLabelsObject (initialValues, updatedValues) {
//   const result = [];

//   const defaultValues ={ color: {hex:"#ffffff",rgb: {
//     "r": 255,
//     "g": 255,
//     "b": 255,
//     "a": 1
//   }},
//   description: ''
//   }


//   updatedValues.forEach((obj2) => {
//     const obj1 = initialValues.find((o) => o.labelId === obj2.labelId);
//     if (!obj1) {
//       result.push({ INSERT: obj2 }); // INSERT
//     } else {
//       Object.keys(obj2).forEach((key) => {
//         if (obj2[key] !== obj1[key]) {
//           result.push({ UPDATE: obj2 });
//           // return;
//         }
//       });
//     }
//   });

//   initialValues
//     .filter((obj1) => updatedValues.find((o) => o.labelId === obj1.labelId))
//     .forEach((obj) => result.push({ DELETE: obj }));

//   return result;
// };

// Create a new array with the same objects but with keys without double quotes

