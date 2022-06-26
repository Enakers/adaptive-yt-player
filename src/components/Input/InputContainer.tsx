import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useStore } from '~/store/StoreProvider';
import styles from '~/styles/InputContainer.module.css';

interface Props {
  children: React.ReactNode;
}

function InputContainer({ children }: Props) {
  const { inputStore } = useStore();
  const fixedPosition = useMemo(() => {
    if (inputStore.inputOptions.fixedPosition || inputStore.inputOptions.method === 'switch') {
      return true;
    }

    return false;
  }, [inputStore.inputOptions]);

  const inputContainer = useCallback((node: HTMLDivElement) => {
    if (fixedPosition || !node) return;

    const { top, left } = inputStore.getRandomPosition();
    node.style.top = top;
    node.style.left = left;
  }, []);

  return (
    <div ref={inputContainer} className={fixedPosition ? styles.inputFixed : styles.inputRandom}>
      {fixedPosition ? <div className={styles.circleContainer}>{children}</div> : children}
    </div>
  );
}

export default observer(InputContainer);
