import { createContext, useReducer } from 'react';
import { dataReducer } from './reducer';


export const initialState: IInitialState = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: { adults: 0, children: 0, infants: 0 },
};



interface IDataContext {
  state: IInitialState;
  dispatch: (args: any) => void;
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