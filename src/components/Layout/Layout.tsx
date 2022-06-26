import Head from 'next/head';
import NavBar from './NavBar';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>Adaptive YT Player</title>
      </Head>
      <NavBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
