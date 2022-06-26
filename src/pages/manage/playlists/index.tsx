import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Container, Table } from 'react-bootstrap';
import * as yup from 'yup';
import ConfirmModal from '~/components/ConfirmModal';
import FormInput from '~/components/Form/FormInput';
import ModalForm from '~/components/Form/ModalForm';
import { useStore } from '~/store/StoreProvider';

function ManagePlaylists() {
  const router = useRouter();
  const { playlistStore } = useStore();
  const isGlobal = useMemo(() => router.query.global === 'true', [router.query]);
  const playlists = useMemo(
    () => (isGlobal ? playlistStore.globalPlaylists : playlistStore.userPlaylists),
    [isGlobal, playlistStore.globalPlaylists, playlistStore.userPlaylists]
  );

  return (
    <Container>
      <h4 className="text-center mb-5 mt-3">
        {isGlobal ? 'Manage global playlists' : 'Manage playlists'}
      </h4>
      <Table bordered>
        <thead>
          <tr>
            <th>Title</th>
            <th>Manage</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map((p, i) => (
            <tr key={i}>
              <td>{p.title}</td>
              <td>
                <Link href={`/manage/playlists/${p.id}`}>Manage</Link>
              </td>
              <td>
                <ConfirmModal
                  onConfirm={async () => {
                    await playlistStore.delete(p.id, p.isGlobal);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalForm
        initialValues={{ title: '', error: null }}
        onSubmit={async ({ title }) => {
          await playlistStore.create(title, isGlobal);
        }}
        title={isGlobal ? 'Create global playlist' : 'Create playlist'}
        btnTitle="Create"
        validationSchema={yup.object({
          title: yup.string().required()
        })}
      >
        <FormInput name="title" label="Playlist title" />
      </ModalForm>
    </Container>
  );
}

export default observer(ManagePlaylists);
