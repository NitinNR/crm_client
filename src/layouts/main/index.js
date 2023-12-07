import { useLocation, Outlet } from 'react-router-dom';
// @mui
import { Box, Link, Container, Typography, Stack } from '@mui/material';
// components
import Logo from '../../components/Logo';
//
// import MainFooter from './MainFooter';
// import MainHeader from './MainHeader';

// ----------------------------------------------------------------------

export default function MainLayout() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  return (
    <Stack sx={{ minHeight: 1 }}>
      {/* <MainHeader /> */}

      <Outlet />

      <Box sx={{ flexGrow: 1 }} />

      {!isHome ? (
        <Typography variant="caption" component="p">It is Not HOME</Typography>
        // <MainFooter />
      ) : (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            position: 'relative',
            bgcolor: 'background.default',
          }}
        >
          <Container>
            <Logo sx={{ mb: 1, mx: 'auto' }} />

            <Typography variant="caption" component="p">
              © All rights reserved
              <br /> made by &nbsp;
              <Link href="https://lifeel.in/">Lifeel.in</Link>
            </Typography>
          </Container>
        </Box>
      )}
    </Stack>
  );
}
