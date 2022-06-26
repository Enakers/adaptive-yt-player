import { observer } from 'mobx-react-lite';
import { Image } from 'react-bootstrap';
import { useStore } from '~/store/StoreProvider';
import InputContainer from './InputContainer';

function Switch() {
  const { inputStore } = useStore();

  return (
    <InputContainer>
      <div
        className="circle"
        style={{
          width: `${inputStore.inputSize.size}px`,
          height: `${inputStore.inputSize.size}px`
        }}
      >
        <Image
          src="/switch.png"
          alt="Switch symbol"
          className="input-img"
          width={inputStore.inputSize.imgSize}
          height={inputStore.inputSize.imgSize}
        />
      </div>
    </InputContainer>
  );
}

export default observer(Switch);
