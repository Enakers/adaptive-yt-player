import {useSession} from 'next-auth/react';
import Link from 'next/link';
import {Container, Image, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {useStore} from '~/store/StoreProvider';
import SearchBar from './SearchBar';

const NavBar = () => {
  const {data: session} = useSession();
  const store = useStore();

  return (
    <Navbar bg="light" className="mb-3" expand="lg">
      <Container fluid>
        <Link href="/" passHref>
          <Navbar.Brand>
            <Image src="/logo.png" alt="YouTube logo" width="32" height="32" className="me-1" />
            Adaptive YT Player
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls="navbar" />

        <Navbar.Collapse id="navbar">
          <Nav>
            <NavDropdown title="User playlists">
              {store.playlistStore.userPlaylists.map((p, i) => (
                <Link href={`/playlist/${p.id}`} key={i} passHref>
                  <NavDropdown.Item>{p.title}</NavDropdown.Item>
                </Link>
              ))}
            </NavDropdown>

            <NavDropdown title="Global playlists">
              {store.playlistStore.globalPlaylists.map((p, i) => (
                <Link href={`/playlist/${p.id}`} key={i} passHref>
                  <NavDropdown.Item>{p.title}</NavDropdown.Item>
                </Link>
              ))}
            </NavDropdown>
          </Nav>

          <SearchBar />

          <Nav className="ms-auto">
            <NavDropdown
              title={
                <Image
                  src={session?.user.image ?? '/person-fill.svg'}
                  alt="user icon"
                  width="32"
                  height="32"
                  roundedCircle
                />
              }
              align="end"
            >
              <NavDropdown.Item onClick={store.logout}>Logout</NavDropdown.Item>
              <Link href="/manage/timers" passHref>
                <NavDropdown.Item>Manage timers</NavDropdown.Item>
              </Link>
              <Link href="/manage/playlists/?global=false" passHref>
                <NavDropdown.Item>Manage playlists</NavDropdown.Item>
              </Link>
              <Link href="/manage/playlists/?global=true" passHref>
                <NavDropdown.Item>Manage global playlists</NavDropdown.Item>
              </Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
