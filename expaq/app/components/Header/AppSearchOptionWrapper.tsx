import { IAppSearchOptionProps } from '@/app/types/Interface';
import { FC } from 'react';


const AppSearchOptionWrapper: FC<IAppSearchOptionProps> = ({ className, children }) => {
  return (
    <div
      className={`${className} absolute px-8 mt-2 bg-white rounded-3xl shadow-arround-bold`}
    >
      {children}
    </div>
  );
};

export default AppSearchOptionWrapper;
