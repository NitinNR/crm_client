import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, Card, Avatar, CardHeader, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// _mock_
import { _appAuthors } from '../../../../_mock';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
}));

// ----------------------------------------------------------------------

export default function AppTopAuthors({ recentUsers }) {

  const displayAuthor = orderBy(recentUsers, ['whatsapp_number']);

  return (
    <Card sx={{ minHeight: { xs: 440, sm: 250, md: 440 } }}>
      <CardHeader title="Recent Users" />
      {displayAuthor.length ? <Stack spacing={2.6} sx={{ p: 3 }}>
        {displayAuthor.map((author, index) => (
          <AuthorItem key={author.whatsapp_number ? author.whatsapp_number : index} author={author} index={index} />
        ))}
      </Stack> :
        <Stack
          spacing={2.6}
          sx={{
            minHeight: { xs: 200, sm: 250, md: 300 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            p: 3
          }}
        >
          <Typography variant="body1">
            No users found
          </Typography>
        </Stack>
      }
    </Card>
  );
}

// ----------------------------------------------------------------------

AuthorItem.propTypes = {
  author: PropTypes.shape({
    avatar: PropTypes.string,
    favourite: PropTypes.number,
    name: PropTypes.string,
  }),
  index: PropTypes.number,
};

function AuthorItem({ author, index }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt={author.fullName} src={author.avatar} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{author.fullName}</Typography>
        <Typography
          variant="caption"
          sx={{
            mt: 0.3,
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <Iconify icon={'material-symbols:phone-android'} sx={{ width: 16, height: 16, mr: 0.5 }} />
          {/* {fShortenNumber(author.whatsapp_number)} */}
          {author.whatsapp_number}
        </Typography>
      </Box>

      <IconWrapperStyle
        sx={{
          ...(index === 1 && {
            color: 'info.main',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          }),
          ...(index === 2 && {
            color: 'info.main',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          }),
        }}
      >
        <Iconify icon={'logos:whatsapp-icon'} width={20} height={20} />
      </IconWrapperStyle>
    </Stack>
  );
}
