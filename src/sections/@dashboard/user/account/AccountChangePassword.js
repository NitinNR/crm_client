import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
// services
import AccountService from '../../../../services/account.service';
import TokenService from '../../../../services/token.service';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const adminId = TokenService.getUser()?.userInfo.id
  const [passwordInfo, setPasswordInfo] = useState({
    status: false,
    ack: '',
    accessToken:'',
    type:'warning',
  });

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // reset();

      if(values.confirmNewPassword.length){
        AccountService.ChangePassword(adminId, values.oldPassword, values.confirmNewPassword)
        .then(response=>{
          // console.log("response", response);
          passwordInfo.status = true
          passwordInfo.ack = response.ack

          if(response.status){
            passwordInfo.type='success'
            TokenService.updateLocalAccessToken(response.data.accessToken)
          }
          // console.log("passwordInfo", passwordInfo);
          setPasswordInfo({...passwordInfo})
          setTimeout(() => {
            setPasswordInfo(passwordInfo.status=false)
          }, 5000);
        })
      }

      // await new Promise((resolve) => setTimeout(resolve, 500));
      // enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      {passwordInfo.status?<Alert sx={{mb:3}} severity={passwordInfo.type}>{passwordInfo.ack}</Alert>:null}


        <Stack spacing={3} alignItems="flex-end">

          <RHFTextField name="oldPassword" type="password" label="Old Password" />

          <RHFTextField name="newPassword" type="password" label="New Password" />

          <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
