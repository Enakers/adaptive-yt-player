import { observer } from 'mobx-react-lite';
import { Image } from 'react-bootstrap';
import { useStore } from '~/store/StoreProvider';
import InputContainer from './InputContainer';

interface Props {
  touch?: boolean;
}

function Click({ touch }: Props) {
  const { inputStore, playerApi } = useStore();

  return (
    <InputContainer>
      <div
        className="circle"
        style={{
          width: `${inputStore.inputSize.size}px`,
          height: `${inputStore.inputSize.size}px`
        }}
        onClick={playerApi.handlePlay}
      >
        <Image
          src={touch ? '/touch.png' : '/mouse.png'}
          alt={touch ? 'Touch symbol' : 'Computer mouse symbol'}
          className="input-img"
          width={inputStore.inputSize.imgSize}
          height={inputStore.inputSize.imgSize}
        />
      </div>
    </InputContainer>
  );
}

export default observer(Click);
