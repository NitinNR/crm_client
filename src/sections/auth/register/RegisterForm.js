import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------



export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // const [ack, setAck] = useState('');

  const [alert, setAlert] = useState({status:false, ack:'', type:'info'});

  const {register} = useAuth()
  const {user} = useAuth()
  const { isAuthenticated } = useAuth();

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().min(2, 'Too Short!').max(100, 'Too Long!').required('Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    chatbotNumber: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('WhatsApp Number required'),
    password: Yup.string().required('Password is required'),
    // confPassword: Yup.string().required('Confirm Password is required'),
    companyName: Yup.string().required('Company Name required'),
    website: Yup.string(),

  });

  const formik = useFormik({
    initialValues: {
      fullName: '',
      lastName: '',
      email: '',
      password: '',
      // confPassword: '',
      companyName: '',
      chatbotNumber:'',
      website:'',
    },
    validationSchema: RegisterSchema,

    onSubmit: async() => {
      console.log("VA",values)
      try{
        await register(values.fullName, values.email, values.password,values.companyName,  values.chatbotNumber, values.website)
      }catch(error){
        // console.log("Error",error,error.ack,"alert:",alert)
        setAlert({...alert, ack: error.ack, status: true, type: "error"})
        // console.log("ALert in Error",alert)
        
        setTimeout(() => {
          // console.log('This will run after 5 second!')
          setAlert({...alert, status: false})
          // console.log("ALert in Error timeout",alert)
        }, 5000);
      }
    },
  });

  useEffect(() => {
    const alert = {status:false, ack:'', type:'info'}
    if (isAuthenticated){
      // console.log("RESPo",user,"alert",alert )
      setAlert({...alert, ack: user.ack, status: true, type: "success"})
      // console.log("ALert in useEffect",alert)
      setTimeout(() => {
        // console.log('This will run after 5 second!')
        setAlert({...alert, status: false})
        // console.log("ALert in useeffect timeout",alert)
        navigate('/auth/login', { replace: true });
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user,isAuthenticated])
  
  // const handleAlert = (newAlert) => {
  //   setAlert({...alert, newAlert});

  // }

  const { errors, touched,values, handleSubmit, isSubmitting, getFieldProps } = formik;


  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
      {alert.status? <Alert severity={alert.type} sx={{ mb: 3 }} >
        {alert.ack}
      </Alert>:null}
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Full name"
              {...getFieldProps('fullName')}
              error={Boolean(touched.fullName && errors.fullName)}
              helperText={touched.fullName && errors.fullName}
            />

            <TextField
              fullWidth
              label="Company Name"
              {...getFieldProps('companyName')}
              error={Boolean(touched.companyName && errors.companyName)}
              helperText={touched.companyName && errors.companyName}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
              fullWidth
              label="WhatsApp Number"
              {...getFieldProps('chatbotNumber')}
              error={Boolean(touched.chatbotNumber && errors.chatbotNumber)}
              helperText={touched.chatbotNumber && errors.chatbotNumber}
            />
          <TextField
              fullWidth
              label="Website"
              {...getFieldProps('website')}
              error={Boolean(touched.website && errors.website)}
              helperText={touched.website && errors.website}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          </Stack>


          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
