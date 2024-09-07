import { createContext, useReducer } from 'react';
import { dataReducer } from './reducer';
import { IInitialState } from '../types/Interface';


export const initialState: IInitialState = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: { adults: 0, children: 0, infants: 0 },
};




type PayloadType = string | number | object | null;

interface IDataContext {
  state: IInitialState;
  dispatch: (value: { type: string; payload?: PayloadType }) => void;
}

export const DataContext = createContext<IDataContext>({ state: initialState, dispatch: () => {} });

// export const ContextProvider = ({ children }) => (
//   <DataContext.Provider value={useReducer(dataReducer, initialState)}>
//     {children}
//   </DataContext.Provider>

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);


  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};