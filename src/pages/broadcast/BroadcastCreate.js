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
import BroadcastNewForm from './BroadcastNewForm';
// Services
import TokenService from "../../services/token.service"

// NR
// desk service
import DeskUserService from '../../services/desk.user.service'
// crm service
import { get_single_brodcast,createBroadcast,updateBroadcast } from '../../services/broadcasts.service';




// ----------------------------------------------------------------------

const userId = TokenService.getUserID();
const spaceId = TokenService.getData("userDetails").space_id;

export default function BroadcastCreate() {
  const { id } = useParams();

  const { themeStretch } = useSettings();
  const [currentUser, setCurrentUser] = useState({})
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const [singleBroadcast, setsingleBroadcast] = useState({})


  // NR=>
  const [whatsappInboxes, setWhatsappInboxes] = useState([])
  const [TAGS_OPTION, setTAGS_OPTION] = useState([])
  // <=NR

  useEffect(async () => {

    if (isEdit) {
      setCurrentUser(TokenService.getData("currentUser"));
      const brd = await get_single_brodcast(userId,id);
      setsingleBroadcast(brd);
    }else{
      // test
    }
    const whatsAppInboxes = await DeskUserService.getWhatsAppInboxes(userId,spaceId);
    const labels = await DeskUserService.getLables(userId,spaceId);
    setTAGS_OPTION(labels.data)
    setWhatsappInboxes(whatsAppInboxes.data)
  }, [])


  // const currentUser =  TokenService.getData("currentUser") // _userList.find((user) => paramCase(user.name) === name);

  const WHATSAPP_INBOXES = [
    { group: 'WhatsApp', classify: whatsappInboxes },
    // { group: 'Instagram', classify: ['FootWerA', 'Lspace', 'knowhow99',] },
    // { group: 'SMS', classify: ['newUsers', 'purchased_users', 'Bracelets'] },
  ];

  const currentBroadcast = {
    inboxes: WHATSAPP_INBOXES,
    tags_option: TAGS_OPTION,
    old_brodcast:singleBroadcast
  }

  return (
    <Page title={!isEdit ? 'Broadcast: Create' : 'Broadcast: Edit'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new Broadcast' : 'Edit Broadcast'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Broadcast', href: PATH_DASHBOARD.broadcast.schedule },
            { name: !isEdit ? 'New Broadast' : capitalCase(name) },
          ]}
        />

        <BroadcastNewForm userId={userId} spaceId={spaceId} bid={id} isEdit={isEdit} currentBroadcast={currentBroadcast} createBroadcast={createBroadcast} updateBroadcast={updateBroadcast} />
      </Container>
    </Page>
  );
}
