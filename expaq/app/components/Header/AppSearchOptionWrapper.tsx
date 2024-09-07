import { FC, PropsWithChildren } from 'react';

interface IAppSearchOptionProps extends PropsWithChildren<any> {
  className: string;
}

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
