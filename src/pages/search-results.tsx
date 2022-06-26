import {observer} from 'mobx-react-lite';
import {useRouter} from 'next/router';
import {useCallback, useRef} from 'react';
import {Container, Image, Spinner, Table} from 'react-bootstrap';
import {useStore} from '~/store/StoreProvider';

interface Props {
  sidebar?: boolean;
}

function SearchResults({sidebar}: Props) {
  const router = useRouter();
  const {ytApi, playlistStore} = useStore();

  const observer = useRef<IntersectionObserver>();
  const observerRef = useCallback(
    (node: HTMLDivElement) => {
      if (ytApi.loading || !node) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && ytApi.nextPageToken) {
          ytApi.search();
        }
      });

      observer.current.observe(node);
    },
    [ytApi]
  );

  return (
    <Container fluid={sidebar}>
      <Table bordered hover className="clickable">
        <tbody>
          {ytApi.videos?.map((v, i) => (
            <tr
              key={i}
              onClick={() =>
                router.push(
                  playlistStore.loadedPlaylist
                    ? `/player/${v.id}/?playlistId=${playlistStore.loadedPlaylist.id}`
                    : `/player/${v.id}`
                )
              }
            >
              <td>
                <Image
                  src={sidebar ? v.thumbnails.default.url : v.thumbnails.medium.url}
                  alt="Video thumbnail"
                />
              </td>
              <td>
                <h5>{v.title}</h5>
                {!sidebar && <p>{v.description}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div ref={observerRef} style={{height: '2rem'}} />

      {ytApi.loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {!ytApi.nextPageToken && <h4 className="text-center">No more results</h4>}
    </Container>
  );
}

export default observer(SearchResults);
