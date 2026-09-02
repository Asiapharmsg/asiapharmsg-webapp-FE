import { Fragment } from 'react';
import App from 'next/app';
import Head from 'next/head';
import withReduxStore from '../lib/with-redux-store';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import fetchProducts from '../redux/actions/productActions';
import products from '../data/products.json';
import '../assets/scss/styles.scss';
import Preloader from '../components/Preloader';
import { PrimeReactProvider } from 'primereact/api';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';

const queryClient = new QueryClient();

class MyApp extends App {
  constructor(props) {
    super(props);
    this.persistor = persistStore(props.reduxStore);
    props.reduxStore.dispatch(fetchProducts(products));
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Fragment>
        <Head>
          <title>AsiaPharmSG</title>
          <link rel="icon" href={process.env.PUBLIC_URL + '/favicon.ico'} />
          <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <PrimeReactProvider>
          <QueryClientProvider client={queryClient}>
            <ToastProvider placement="bottom-left">
              <Provider store={reduxStore}>
                <PersistGate loading={<Preloader />} persistor={this.persistor}>
                  <Component {...pageProps} />
                </PersistGate>
              </Provider>
            </ToastProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PrimeReactProvider>
      </Fragment>
    );
  }
}

export default withReduxStore(MyApp);
