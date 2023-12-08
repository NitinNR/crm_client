import React from 'react';
import { Container, Typography } from '@mui/material';

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
};

const ComingSoon = () => {
  return (
    <Container style={containerStyles}>
      <Typography variant="h1" align="center" gutterBottom>
        Coming Soon
      </Typography>
      <Typography variant="h4" align="center">
        Application feature is under construction.
      </Typography>
      {/* You can add more components like a countdown, subscribe form, etc. */}
    </Container>
  );
};

export default ComingSoon;
