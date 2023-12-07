import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone Number is required'),
    companyName: Yup.string().required('Company Name is required'),
    website: Yup.string().required('Website is required'),
  });

  const defaultValues = {
    displayName: user?.fullName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    phoneNumber: user?.chatbotNumber || '',
    companyName: user?.companyName || '',
    role: user?.role || '',
    website: user?.website || '',
    // country: user?.country || '',

    // address: user?.address || '',
    // state: user?.state || '',
    // city: user?.city || '',
    // zipCode: user?.zipCode || '',
    // about: user?.about || '',
    // isPublic: user?.isPublic || '',

  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("VALUES", values);
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  useEffect(() => {
    // log
  }, [])


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>


        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 2fr)', sm: 'repeat(3, 2fr)' },
              }}
            >
              <RHFTextField name="displayName" label="Name" />
              <RHFTextField name="email" label="Email Address" />

              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="role" label="Role" value={defaultValues.role} />

              {/* <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect> */}

              <RHFTextField name="companyName" label="Company Name" />

              <RHFTextField name="website" label="website" />

              {/* <RHFTextField name="zipCode" label="Zip/Code" /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton disabled type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
