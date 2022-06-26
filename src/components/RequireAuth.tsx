import { observer } from 'mobx-react-lite';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useStore } from '~/store/StoreProvider';
import InputSelect from './Input/InputSelect';
import Loader from './Loader';

interface Props {
  children: JSX.Element;
}

const RequireAuth = ({ children }: Props) => {
  const store = useStore();
  const { data: session, status } = useSession({ required: true });

  useEffect(() => {
    if (status === 'loading') return;

    if (session.tokenData.error) {
      signIn();
      return;
    }

    store.setTokenData(session.tokenData);
    store.setUserId(session.user.id);
  }, [status, session, store]);

  if (store.appLoading || status === 'loading') {
    return <Loader />;
  }

  if (!store.inputStore.inputOptions.method) {
    return <InputSelect />;
  }

  return children;
};

export default observer(RequireAuth);
