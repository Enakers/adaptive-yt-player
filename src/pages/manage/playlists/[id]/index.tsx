import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Container, Table } from 'react-bootstrap';
import ConfirmModal from '~/components/ConfirmModal';
import { useStore } from '~/store/StoreProvider';

function ManagePlaylist() {
  const router = useRouter();
  const { playlistStore } = useStore();
  const playlist = useMemo(
    () => playlistStore.playlists.find(p => p.id === router.query.id),
    [router.query, playlistStore.playlists]
  );

  return (
    <Container>
      <h4 className="text-center mb-5 mt-3">Manage {playlist?.title} videos</h4>
      <Table bordered>
        <thead>
          <tr>
            <th>Title</th>
            <th>Manage timers</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {playlist?.videos.map((v, i) => (
            <tr key={i}>
              <td>{v.title}</td>
              <td>
                <Link href={`/manage/playlists/${playlist.id}/video/${v.id}`}>Manage timers</Link>
              </td>
              <td>
                <ConfirmModal
                  onConfirm={async () => {
                    await playlistStore.deleteVideo(playlist.id, v.id, playlist.isGlobal);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default observer(ManagePlaylist);
