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
  query?: any;
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