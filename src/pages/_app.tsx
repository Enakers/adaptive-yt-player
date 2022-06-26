import 'bootstrap/dist/css/bootstrap.min.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Layout from '~/components/Layout/Layout';
import RequireAuth from '~/components/RequireAuth';
import StoreProvider from '~/store/StoreProvider';
import '~/styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <RequireAuth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RequireAuth>
      </StoreProvider>
    </SessionProvider>
  );
}

export default MyApp;
