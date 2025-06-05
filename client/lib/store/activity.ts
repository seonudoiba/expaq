import { create } from 'zustand';
import { Country, City, ActivityType } from '@/types';

interface ActivityState {
  countries: Country[];
  cities: City[];
  activityTypes: ActivityType[];
  selectedCountry: string;
  setCountries: (countries: Country[]) => void;
  setCities: (cities: City[]) => void;
  setActivityTypes: (activityTypes: ActivityType[]) => void;
  setSelectedCountry: (country: string) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  countries: [],
  cities: [],
  activityTypes: [],
  selectedCountry: '',
  setCountries: (countries) => set({ countries }),
  setCities: (cities) => set({ cities }),
  setActivityTypes: (activityTypes) => set({ activityTypes }),
  setSelectedCountry: (country) => set({ selectedCountry: country }),
}));
