import { Video } from '@prisma/client';
import * as yup from 'yup';
import { useStore } from '~/store/StoreProvider';
import FormSelect from './Form/FormSelect';
import ModalForm from './Form/ModalForm';

interface Props {
  video: Video;
}

function AddToPlaylist({ video }: Props) {
  const { playlistStore } = useStore();

  return (
    <ModalForm
      initialValues={{ playlistId: '', error: null }}
      onSubmit={async v => {
        await playlistStore.addVideo(v.playlistId, video);
      }}
      title="Add to playlist"
      validationSchema={yup.object({
        playlistId: yup.string().required()
      })}
    >
      <FormSelect name="playlistId" label="Select playlist">
        <option disabled value="">
          Select a playlist
        </option>
        {playlistStore.playlists.map((p, i) => (
          <option key={i} value={p.id}>
            {p.isGlobal ? `${p.title} (global)` : p.title}
          </option>
        ))}
      </FormSelect>
    </ModalForm>
  );
}

export default AddToPlaylist;
