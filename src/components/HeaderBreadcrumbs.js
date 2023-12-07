import isString from 'lodash/isString';
import PropTypes from 'prop-types';
// @mui
import { Box, Typography, Link } from '@mui/material';
//
import Breadcrumbs from './Breadcrumbs';

// ----------------------------------------------------------------------

HeaderBreadcrumbs.propTypes = {
  links: PropTypes.array,
  action: PropTypes.node,
  heading: PropTypes.string.isRequired,
  moreLink: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  sx: PropTypes.object,
};

export default function HeaderBreadcrumbs({ links, action, heading, subtitle, moreLink = '' || [], sx, ...other }) {
  return (
    <Box sx={{ mb: 5, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom>
            {heading}
          </Typography>
          {subtitle?
          <Typography variant="subtitle" gutterBottom>
            {subtitle}
          </Typography>:null}
          {links?<Breadcrumbs links={links} {...other} />:null}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>

      <Box sx={{ mt: 2 }}>
        {isString(moreLink) ? (
          <Link href={moreLink} target="_blank" rel="noopener" variant="body2">
            {moreLink}
          </Link>
        ) : (
          moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))
        )}
      </Box>
    </Box>
  );
}
