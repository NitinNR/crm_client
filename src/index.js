// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// react-query
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


import { SnackbarProvider } from 'notistack';

//
import App from './App';
import * as serviceWorker from './serviceWorker';

// Auth 
import { AuthProvider } from './contexts/JWTContext';

// ----------------------------------------------------------------------

const queryClient = new QueryClient()

ReactDOM.render(
  <AuthProvider>
  <HelmetProvider>
    <BrowserRouter>
    <SnackbarProvider maxSnack={3}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </HelmetProvider>
  </AuthProvider>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
