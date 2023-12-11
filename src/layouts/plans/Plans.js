import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, List, ListItem } from '@mui/material';
import { useSnackbar } from 'notistack';

import PlanService from '../../services/plan.service';
import TokenService from "../../services/token.service"

const period = { 0: "/Month", 1: "/Year", 2: " Life Time" };

const adminId = TokenService.getUserID();

const Plans = () => {

  const { enqueueSnackbar } = useSnackbar();
  const submitBtn = useRef(null);

  const [plans, setPlans] = useState([])

  useEffect(() => {
    // get the plans data from db
    PlanService.PlanList().then(data => {
      if (data.status) {
        console.log(data.data);
        setPlans(data.data);
      }
    })
  }, [])

  const UpdatePlan = (plan_id) => {
    PlanService.PlanUpdate(adminId, plan_id).then(data => {
      enqueueSnackbar("Plan updated successfully");
      const buttonElement = submitBtn.current;
      if (buttonElement) {
        // buttonElement.disabled = true
        buttonElement.textContent = "Selected plan";
      }

    }).catch(e => {
      enqueueSnackbar("Plan updation failed");
    })
  }

  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        Choose Your Plan
      </Typography>
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
                <Button ref={submitBtn} variant="contained" color="primary" fullWidth onClick={() => { UpdatePlan(plan.id) }}>
                  Select Plan
                </Button>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Plans;
