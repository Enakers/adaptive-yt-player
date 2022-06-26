import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { Image } from 'react-bootstrap';
import { useStore } from '~/store/StoreProvider';
import InputContainer from './InputContainer';

// FIXME inner circle is off center

function EyeGaze() {
  const { playerApi, inputStore } = useStore();
  const innerCircle = useRef<HTMLDivElement>(null);
  let timeout: NodeJS.Timeout;

  return (
    <InputContainer>
      <div
        className="circle"
        onMouseEnter={() => {
          clearTimeout(timeout);
          innerCircle.current!.style.animation = `grow-bg ${inputStore.inputOptions.dwellTime}s linear backwards`;
          innerCircle.current!.classList.add('animate');
          timeout = setTimeout(() => {
            playerApi.handlePlay();
          }, inputStore.inputOptions.dwellTime * 1000);
        }}
        onMouseLeave={() => {
          clearTimeout(timeout);
          innerCircle.current!.style.animation = '';
          innerCircle.current!.classList.remove('animate');
        }}
        style={{
          width: `${inputStore.inputSize.size}px`,
          height: `${inputStore.inputSize.size}px`
        }}
      >
        <div
          className="inner-circle"
          ref={innerCircle}
          style={{
            width: `${inputStore.inputSize.size}px`,
            height: `${inputStore.inputSize.size}px`
          }}
        />
        <Image
          src="/eye.png"
          alt="eye symbol"
          className="input-img"
          width={inputStore.inputSize.imgSize}
          height={inputStore.inputSize.imgSize}
        />
      </div>
    </InputContainer>
  );
}

export default observer(EyeGaze);
