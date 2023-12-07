import jwtDecode from 'jwt-decode';
import { verify, sign } from 'jsonwebtoken';
// import { useNavigate } from 'react-router-dom';
// MUI
// import Snackbar from '@mui/material/Snackbar';

//
import axios from './axios';
// Services
import TokenService from '../services/token.service'




// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  // ----------------------------------------------------------------------

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  // console.log("decoded",decoded, "currentTime", currentTime)

  return decoded.exp > currentTime;
};

 const handleTokenExpired = (exp) => {
  let expiredTimer;
  
  window.clearTimeout(expiredTimer);
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  // console.log("timeLeft",timeLeft);
  expiredTimer = window.setTimeout(async() => {
    try{
    console.log('expired');
    // console.log("Sending refresh token", TokenService.getLocalRefreshToken())
    const rs = await axios.post('/api/auth/refreshtoken', {
      refreshToken: TokenService.getLocalRefreshToken(),
    });
    
    const { accessToken } = rs.data;
    TokenService.updateLocalAccessToken(accessToken);
    }catch(error){
      if(!error.status){
        console.log("ACK",error.ack)
        // navigate('/dashboard', { replace: true });
      }
    }
    // You can do what ever you want here, like show a notification
  }, timeLeft);
  // console.log("expiredTimer",expiredTimer)
};

// ----------------------------------------------------------------------

const setSession = (accessToken) => {
  if (accessToken) {
    // localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common['x-access-token'] = `${accessToken}`;
    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken);
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common['x-access-token'];
  }
};

export { isValidToken, setSession, verify, sign };
