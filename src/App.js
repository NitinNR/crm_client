// routes
import Router from './routes/index'
// theme
import ThemeProvider from './theme';
// components
import { ProgressBarStyle } from './components/ProgressBar';
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <ProgressBarStyle />
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
