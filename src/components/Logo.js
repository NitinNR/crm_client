import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR
  // const logo = <Box component="img" src="/static/logo.svg" sx={{ width: 40, height: 40, ...sx }} />

  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <g fill={PRIMARY_MAIN} fillRule="evenodd"  stroke="none" strokeWidth="1" transform="translate(0.000000,98.000000) scale(0.1,-0.1)">
          <path
            fill="url(#BG1)"
            d="M315 637 c-63 -85 -115 -163 -115 -175 0 -25 17 -31 111 -34 l66 -3
            -63 -110 c-35 -60 -63 -117 -64 -126 0 -19 20 -39 40 -38 8 0 121 87 250 192
            286 234 298 257 143 257 -40 0 -73 2 -73 3 0 2 29 33 65 69 36 35 65 70 65 76
            0 6 -7 18 -16 26 -12 13 -41 16 -155 16 l-139 0 -115 -153z"
          />
          <path
            fill="url(#BG2)"
            d="M315 637 c-63 -85 -115 -163 -115 -175 0 -25 17 -31 111 -34 l66 -3
            -63 -110 c-35 -60 -63 -117 -64 -126 0 -19 20 -39 40 -38 8 0 121 87 250 192
            286 234 298 257 143 257 -40 0 -73 2 -73 3 0 2 29 33 65 69 36 35 65 70 65 76
            0 6 -7 18 -16 26 -12 13 -41 16 -155 16 l-139 0 -115 -153z"
          />
          <path
            fill="url(#BG3)"
            d="M315 637 c-63 -85 -115 -163 -115 -175 0 -25 17 -31 111 -34 l66 -3
            -63 -110 c-35 -60 -63 -117 -64 -126 0 -19 20 -39 40 -38 8 0 121 87 250 192
            286 234 298 257 143 257 -40 0 -73 2 -73 3 0 2 29 33 65 69 36 35 65 70 65 76
            0 6 -7 18 -16 26 -12 13 -41 16 -155 16 l-139 0 -115 -153z"
          />
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
