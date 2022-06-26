import {observer} from 'mobx-react-lite';
import {useRouter} from 'next/router';
import {useMemo} from 'react';
import {Button, Container, Table} from 'react-bootstrap';
import * as yup from 'yup';
import ConfirmModal from '~/components/ConfirmModal';
import FormInput from '~/components/Form/FormInput';
import ModalForm from '~/components/Form/ModalForm';
import {useStore} from '~/store/StoreProvider';

function ManageVideoTimers() {
  const router = useRouter();
  const {playlistStore} = useStore();
  const playlist = useMemo(() => {
    return playlistStore.playlists.find(p => p.id === router.query.id);
  }, [router.query, playlistStore.playlists]);
  const video = useMemo(() => {
    return playlist?.videos.find(v => v.id === router.query.videoId);
  }, [router.query, playlist]);

  return (
    <Container>
      <h4 className="text-center mb-5 mt-3">Manage {video?.title} timers</h4>
      <Table bordered>
        <thead>
          <tr>
            <th>Index</th>
            <th>Time</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {video?.timers.map((t, i) => (
            <tr key={i}>
              <td>{t.index}</td>
              <td>{t.videoTime}</td>
              <td>
                {t.index === video.timers.length - 1 ? (
                  <ConfirmModal
                    onConfirm={async () => {
                      await playlistStore.deleteVideoTimer(
                        playlist!.id,
                        video!.id,
                        t.index,
                        playlist!.isGlobal
                      );
                    }}
                  />
                ) : (
                  <Button variant="danger" disabled>
                    Not allowed
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalForm
        initialValues={{minutes: 0, seconds: 0, error: null}}
        onSubmit={async ({minutes, seconds}) => {
          await playlistStore.addVideoTimer(playlist!.id, video!.id, minutes, seconds);
        }}
        validationSchema={yup.object({
          minutes: yup.number(),
          seconds: yup.number()
        })}
        title="Create video timer"
        btnTitle="Create"
      >
        <FormInput name="minutes" label="Minutes" type="number" />
        <FormInput name="seconds" label="Seconds" type="number" />
      </ModalForm>
    </Container>
  );
}

export default observer(ManageVideoTimers);
