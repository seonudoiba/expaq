import { createContext, Dispatch, useReducer } from 'react';
import { dataReducer } from './reducer';

interface IInitialState {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
}

export const initialState: IInitialState = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: { adults: 0, children: 0, infants: 0 },
};


export const DataContext = createContext<[any, Dispatch<any>] | null>(null);

export const ContextProvider = ({ children }) => (
  <DataContext.Provider value={useReducer(dataReducer, initialState)}>
    {children}
  </DataContext.Provider>
);


// import { createContext, useReducer, ReactNode } from 'react';
// import { dataReducer } from './reducer';
// import { GlobalContent } from '../types/Interface';

// // Define the initial state interface
// interface IInitialState {
//   location: string;
//   checkIn: Date | null;
//   checkOut: Date | null;
//   guests: {
//     adults: number;
//     children: number;
//     infants: number;
//   };
// }

// // Define the initial state
// export const initialState: IInitialState = {
//   location: '',
//   checkIn: null,
//   checkOut: null,
//   guests: { adults: 0, children: 0, infants: 0 },
// };



// // Create the context
// export const DataContext = createContext<GlobalContent | null>(null);

// // Define the provider props
// interface ContextProviderProps {
//   children: ReactNode;
// }

// // Context provider component
// export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
//   const [state, dispatch] = useReducer(dataReducer, initialState);

//   const value: GlobalContent = { state, dispatch };

//   return (
//     <DataContext.Provider value={value}>
//       {children}
//     </DataContext.Provider>
//   );
// };