import { useRef, useState , useEffect} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';
// hooks
import useAuth from '../../hooks/useAuth';
// Services
import TokenService from '../../services/token.service'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/dashboard',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '/dashboard/account',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '/dashboard/account',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);
  const [userDetails, setUserDetails] = useState([]);
  const {logout} = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async() => {
    handleClose()
    try{
      await logout()
      enqueueSnackbar('Successfully Logged-out!')
      // console.log("logout()",logout())  
      // console.log("isAuthenticated",isAuthenticated, user)  

    }catch(error){
      // log
    }
    
  };

  useEffect(() => {
    if (!userDetails.length) {
      // console.log('TokenService.getData("userDetails")',TokenService.getData("userDetails"))
      handleUserDetails(TokenService.getData("userDetails"))
    }

    return ()=>{
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleUserDetails = (details) => {
    setUserDetails(details)
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userDetails?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userDetails?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
