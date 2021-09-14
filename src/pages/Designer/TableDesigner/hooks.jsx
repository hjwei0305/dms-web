import { useReducer, useContext } from 'react';
import { Ctx } from './context';

// 使用最顶层组件的 setState
export const useGlobal = () => useContext(Ctx);

export const useSet = initState => {
  const [state, setState] = useReducer(
    (oldState, newState) => ({ ...oldState, ...newState }),
    initState,
  );
  return [state, setState];
};
