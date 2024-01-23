// PaymentSuccess.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { PATH_DASHBOARD } from '../routes/paths';
// import PlanService from '../../services/plan.service';


const PaymentSuccess = () => {

  const navigate = useNavigate()
  const [isGenuinePay, setisGenuinePay] = useState(false)
  useEffect(() => {
    const pay_page = "https://checkout.stripe.com/";
    const redirect_from = document.referrer;
    if (pay_page === redirect_from) {
      setisGenuinePay(true)


      // const UpdateUserPlan = (plan_id) => {

      //   setUserPlanId(plan_id)
      //   PlanService.PlanUpdate(adminId, plan_id).then(data => {
      //     if (data?.status) {
      //       enqueueSnackbar("Plan updated successfully");
      //     } else {
      //       enqueueSnackbar("Plan updation failed");
      //     }
      //   }).catch(e => {
      //     enqueueSnackbar("Plan updation failed");
      //   })

      // }()


    }

    setTimeout(() => {
      navigate(PATH_DASHBOARD.plans.root);
    }, 7000);
    return () => { }

  }, [])



  const containerStyle = {
    textAlign: 'center',
    margin: '50px auto',
    maxWidth: '600px',
  };

  const successHeaderStyle = {
    color: '#4caf50',
  };

  const errorHeaderStyle = {
    color: 'red',
  };

  const successMessageStyle = {
    fontSize: '18px',
    color: '#333',
    marginBottom: '20px',
  };

  const imageStyle = {
    width: '100%',
    maxWidth: '400px',
    borderRadius: '8px',
    margin: '20px 0',
  };

  return (
    <>

      {isGenuinePay ?
        <div style={containerStyle}>
          <h1 style={successHeaderStyle}>Payment Successful!</h1>
          <p style={successMessageStyle}>
            Thank you for your purchase. Your payment was successful.
          </p>

          <Box sx={{ width: '100%' }}>
            <LinearProgress />

            <p style={successMessageStyle}>
              Redirecting to plan page...
            </p>
          </Box>

        </div>
        :
        <div style={containerStyle}>
          <h1 style={errorHeaderStyle}>Do not try this again otherwise ;(</h1>

          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        </div>

      }
    </>
  );
};

export default PaymentSuccess;
