import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { store } from '../state/store';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp
