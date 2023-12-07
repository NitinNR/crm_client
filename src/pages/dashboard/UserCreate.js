import { useState, useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewForm from '../../sections/@dashboard/user/UserNewForm';
// Services
import TokenService from "../../services/token.service"

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const [currentUser, setCurrentUser] = useState({})
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');

  useEffect(() => {

    console.log(currentUser);

    if (isEdit) {
      setCurrentUser(TokenService.getData("currentUser"));
    }
  }, [])


  // const currentUser =  TokenService.getData("currentUser") // _userList.find((user) => paramCase(user.name) === name);

  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New user' : capitalCase(name) },
          ]}
        />

        <UserNewForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
