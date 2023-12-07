import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate} from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
// hooks
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const {login} = useAuth();
  const {isAuthenticated} = useAuth();
  const {user} = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [ack, setAck] = useState('');
  const [alert, setAlert] = useState({status:false, ack:'', type:'info'});

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    
    onSubmit: async() => {
      
      try{
        await login(values.email,values.password)
        window.location.reload(false);
      }catch(error){
        setAlert({...alert, ack: error.ack, status: true, type: "error"})
        setTimeout(() => {
          setAlert({...alert, status: false})
        }, 2000);
      }
      // console.log("Email",values.email)
      // navigate('/dashboard', { replace: true });
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };


  useEffect(() => {
    if(isAuthenticated && user){
      console.log("USER in LoginForm", user)
      setAlert({...alert, ack: user.ack, status: true, type: "success"})
      setTimeout(() => {
        setAlert({...alert, status: false})
        navigate('/dashboard', { replace: true });
      }, 3000);
    }else if(!isAuthenticated && user){
      setAlert({...alert, ack: user.ack, status: true, type: "error"})
      setTimeout(() => {
        setAlert({...alert, status: false})
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user])
  

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
      {alert.status? <Alert severity={alert.type} sx={{ mb: 3 }} >
        {alert.ack}
      </Alert>:null}
        <Stack spacing={3}>
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          {/* <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link> */}
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
