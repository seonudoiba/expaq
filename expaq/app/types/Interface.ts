import { ChangeEvent, FocusEvent, PropsWithChildren } from 'react';


export interface IExploreNearby {
  location: string;
  img: string;
  distance: string;
}

export interface ILiveAnywhere {
  img: string;
  title: string;
}


export   interface DataContextType {
  location: string;
}


export interface NavbarProps {
  exploreNearby?: IExploreNearby[];
  searchPage?: boolean;
  query?: string;
}



export interface IExploreNearby {
  location: string;
  img: string;
  distance: string;
}

export interface ILiveAnywhere {
  img: string;
  title: string;
}

export interface IAppHeaderOptionProps extends PropsWithChildren<object> {
  active?: boolean;
  isSnap?: boolean;
  isActiveHeader?: boolean;
  onClick?: () => void;
}

export interface IAppSearchOptionButtonProps extends PropsWithChildren<object> {
  relative?: boolean;
  withSearch?: boolean;
  separator?: boolean;
  isSearch?: boolean;
  type?: string;
  title: string;
  placeholder: string;
  active: boolean;
  value: string | null | Date | guestProps | number | boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
  onClear: () => void;
}

export interface IAppSearchOptionProps extends PropsWithChildren<object> {
  className: string;
}
export interface IAppSearchOptionWrapperMobileProps extends PropsWithChildren<object> {
  title: string;
  handleOnBack: () => void;
  haveNavigation: boolean;
}

export interface IInitialState {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
}

export interface IFormatGuestOptions {
  noInfants?: boolean;
}
export interface guestProps{
  children:number,
  adults:number,
  infants:number
}
// Define the global content type
export type GlobalContent = {
  state: IInitialState;
  dispatch: (action: any) => void;
};