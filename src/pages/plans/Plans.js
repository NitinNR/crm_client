import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, List, ListItem, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import { loadStripe } from '@stripe/stripe-js';
import PlanService from '../../services/plan.service';
import PaymentService from '../../services/pay.service';
import TokenService from "../../services/token.service";
import { STRIPE_PAY } from '../../config';



const period = { 0: "", 1: "/Month", 2: "/Year", 3: " Life Time" };

const adminId = TokenService.getUserID();

const Plans = () => {

  const { enqueueSnackbar } = useSnackbar();
  const submitBtn = useRef(null);

  const [plans, setPlans] = useState([])
  const [userPlanId, setUserPlanId] = useState(1);

  useEffect(async () => {
    // get the plans data from db
    PlanService.PlanList().then(data => {
      if (data.status) {
        setPlans(data.data);
      }
    })

    // get user plan id
    const admin_active_plan = await PlanService.PlanAdmin(adminId);
    if (admin_active_plan.status) {
      setUserPlanId(admin_active_plan.data[0].plan_id)
    } else {
      enqueueSnackbar("Didn't found any active plan ! Switch to Free plan");
    }
  }, [])

  const PayAndUpdatePlan = async (plan_id) => {

    // if user wants to DOWN-GRADE plan
    // if(plan_id < userPlanId) return enqueueSnackbar("For now you can't Downgrade the plan!\nContact Lifeel Support");

    if (plan_id === 1) {
      // prompt user a confirmation message.
      return UpdateUserPlan(plan_id);
    }

    console.log(STRIPE_PAY.API_KEY_FRONTEND)
    const stripePromise = await loadStripe(STRIPE_PAY.API_KEY_FRONTEND);
    const response = await PaymentService.Payment(adminId, plan_id);
    if (response.id) {
      return stripePromise.redirectToCheckout({ sessionId: response.id });
    }
    enqueueSnackbar("Something went wrong Try after some time !");
  }

  const UpdateUserPlan = (plan_id) => {

    PlanService.PlanUpdate(adminId, plan_id).then(data => {
      if (data?.status) {
        setUserPlanId(plan_id);
        enqueueSnackbar("Plan updated successfully");
      } else {
        enqueueSnackbar("Plan updation failed");
      }
    }).catch(e => {
      enqueueSnackbar("Plan updation failed");
    })

  }

  const CancelPlan = async ({ plan_id }) => {
    console.log("cancel this plan id :", plan_id);
    const status_info = await PlanService.PlanCancel(adminId, plan_id);
    if (!status_info.status) enqueueSnackbar("Something went wrong Try after some time !");
    else {
      setUserPlanId(0);
    }
    return status_info;

  }

  const CancelButton = (plan_id) => {

    const [isloading, setIsloading] = useState(false);
    return <>
      <LoadingButton
        loading={isloading}
        fullWidth
        disabled={plan_id.plan_id===1 || plan_id.plan_id === 4}
        variant="outlined"
        color='error'
        onClick={async () => {
          setIsloading(true);
          const status_info = await CancelPlan(plan_id);
          console.log(status_info);
          if (status_info) {
            setIsloading(status_info.status);
          }

        }}
      >
        Cancel
      </LoadingButton>
    </>
  }



  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Choose Your Plan
      </Typography>
      <Box sx={{ m: 10 }} />
      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card style={{ height: '100%' }}>
              <CardContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" align="center" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h6" color="textSecondary" align="center" gutterBottom>
                  {plan.currency}{plan.price}{period[plan.period]}
                </Typography>

                <ListItem key={1}>{plan.broadcasts_limit} Brodcasts</ListItem>
                <ListItem key={2}>{plan.contacts_limit} Contacts</ListItem>

                <List style={{ flex: 1, overflowY: 'auto' }}>
                  {plan.features.split(",").map((feature, featureIndex) => (
                    <ListItem key={featureIndex}>- {feature}</ListItem>
                  ))}
                </List>
                {/* <Button  disabled={plan.title === "Free Plan"} variant="contained" color="primary" fullWidth>
                  {plan.title === "Free Plan"? "Selected Plan":"Select Plan"}
                </Button> */}
                {/* <Button disabled={plan.id === userPlanId} ref={submitBtn} variant="contained" color="primary" fullWidth onClick={() => { PayAndUpdatePlan(plan.id) }}>
                  {plan.id === userPlanId ? <CancelButton /> : "Select Plan"}
                </Button> */}
                {
                  plan.id === userPlanId ? <CancelButton plan_id={plan.id} /> : <Button disabled={plan.id === userPlanId} ref={submitBtn} variant="contained" color="primary" fullWidth onClick={() => { PayAndUpdatePlan(plan.id) }}>
                    Select Plan
                  </Button>
                }

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Plans;
