import { observer } from 'mobx-react-lite';
import * as yup from 'yup';
import { useStore } from '~/store/StoreProvider';
import FormCheckbox from './FormCheckbox';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import ModalForm from './ModalForm';

interface Props {
  name: string;
  loadPlaylistPage: string;
  loadOnInit: boolean;
  title: string;
  update?: boolean;
}

function ConfigForm({ name, loadPlaylistPage, loadOnInit, title, update }: Props) {
  const { inputStore, playlistStore } = useStore();

  return (
    <ModalForm
      initialValues={{ error: null, name, loadPlaylistPage, loadOnInit }}
      onSubmit={async v => {
        await inputStore.createOrUpdateConfig(
          v.name,
          v.loadOnInit,
          v.loadPlaylistPage ?? null,
          update
        );
      }}
      validationSchema={yup.object({
        name: yup.string().required()
      })}
      title={title}
    >
      <FormInput name="name" label="Config name" />
      <FormSelect name="loadPlaylistPage" label="Playlist page">
        <option value="" defaultValue="">
          None
        </option>
        {playlistStore.playlists.map((p, i) => (
          <option value={p.id} key={i}>
            {p.isGlobal ? `${p.title} (global)` : p.title}
          </option>
        ))}
      </FormSelect>
      <FormCheckbox name="loadOnInit" label="Load on startup" isChecked={loadOnInit} />
    </ModalForm>
  );
}

export default observer(ConfigForm);
