import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { MenuItem, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// ant
import {Form, Input} from 'antd';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/Iconify';
import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  appData: PropTypes.object,
};

export default function UserMoreMenu({ onDelete, appData, displayName, formFields }) {
  const [open, setOpen] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleDialog = () => {
    setDialogOpen(!dialogOpen);
    handleClose()
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  const ChannelForm = () => {
    const initialValues = appData?.configs;
    
    return (
      <Form initialValues={initialValues} style={{ maxWidth: 800 }} >
        {Object.entries(formFields[0]).map(([key, value]) => (
          key!=="channelName"?
          <Form.Item key={key} label={value} name={key}>
            <Input />
          </Form.Item>
          :null
        ))}
      </Form>
    );
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem onClick={onDelete} sx={{ color: 'error.main' }} style={{opacity:0.6, pointerEvents:'none'}}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Delete
        </MenuItem>

        <MenuItem onClick={handleDialog} style={{opacity:0.6, pointerEvents:'none'}} > 
        {/* component={RouterLink} to={`${PATH_DASHBOARD.user.root}/${paramCase(userName)}/edit`} */}
          <Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />
          Edit
        </MenuItem>
      </MenuPopover>
      <Dialog open={dialogOpen} onClose={handleDialog}>
        <DialogTitle>Edit Application Details</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Edit 
          </DialogContentText> */}
          <React.Fragment key={displayName}>
            <h3>{displayName}</h3>
            <ChannelForm />
          </React.Fragment>
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          /> */}
        </DialogContent>
          <DialogActions>
            <Button onClick={handleDialog}>Cancel</Button>
            <Button onClick={handleDialog}>Save</Button>
          </DialogActions>
        </Dialog>
    </>
  );
}
