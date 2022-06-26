import { observer } from 'mobx-react-lite';
import { useStore } from '~/store/StoreProvider';
import Click from './Click';
import EyeGaze from './EyeGaze';
import Switch from './Switch';

function Input() {
  const { playerApi, inputStore } = useStore();

  if (!playerApi.started || playerApi.isPlaying) return null;

  switch (inputStore.inputOptions.method) {
    case 'eye gaze':
      return <EyeGaze />;
    case 'switch':
      return <Switch />;
    case 'mouse':
      return <Click />;
    case 'touch':
      return <Click touch />;
    default:
      return <div>No input selected</div>;
  }
}

export default observer(Input);
