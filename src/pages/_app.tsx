import type { AppProps } from 'next/app';
import StoreProvider from '~/store/StoreProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
