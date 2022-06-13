import { enableStaticRendering } from 'mobx-react-lite';
import { Context, createContext, ReactNode, useContext } from 'react';
import RootStore from './rootStore';

enableStaticRendering(typeof window === 'undefined');

let StoreContext: Context<RootStore>;
export const useStore = () => useContext(StoreContext);

let store: RootStore;
const initStore = () => {
  const _store = store ?? new RootStore();

  if (typeof window === 'undefined') return _store;

  if (!store) store = _store;

  return _store;
};

interface Props {
  children: ReactNode;
}

const StoreProvider = ({ children }: Props) => {
  const _store = initStore();
  StoreContext = createContext(_store);

  return <StoreContext.Provider value={_store}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
