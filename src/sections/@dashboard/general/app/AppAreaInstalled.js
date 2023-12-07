import merge from 'lodash/merge';
import { useState,useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const currentyear = new Date().getFullYear();

const CHART_DATA = [
  {
    year: currentyear-1,
    data: [
      { name: 'WhatsApp', data: [0,0,0,0,0,0,0,0,0,0,0,0] },
    ],
  },
  {
    year: currentyear,
    data: [
      { name: 'WhatsApp', data: [0,0,0,0,0,0,0,0,0,0,0,0] },
    ],
  },
];


export default function AppAreaInstalled({userengagement}) {

  useEffect(()=>{
    
  },[])

  const years = [currentyear-1,currentyear];
  CHART_DATA[0].data[0].data = userengagement[years[0]]?userengagement[years[0]]:[0,0,0,0,0,0,0,0,0,0,0,0];
  CHART_DATA[1].data[0].data = userengagement[years[1]]?userengagement[years[1]]:[0,0,0,0,0,0,0,0,0,0,0,0];

  const [seriesData, setSeriesData] = useState(currentyear);

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
    },
  });

  return (
    <Card>
      <CardHeader
        title="User Engagement"
        // subheader="(+43%) than last year"
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': {
                pl: 1,
                py: 0.5,
                pr: '24px !important',
                typography: 'subtitle2',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.75,
                bgcolor: 'background.neutral',
              },
              '& .MuiNativeSelect-icon': {
                top: 4,
                right: 0,
                width: 20,
                height: 20,
              },
            }}
          >
            {CHART_DATA.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="line" series={item.data} options={chartOptions} height={344} />
          )}
        </Box>
      ))}
    </Card>
  );
}
