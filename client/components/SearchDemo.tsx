
import React, { useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';
import { MapPin, Globe } from 'lucide-react';

interface Address {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const SearchDemo: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [currentCity, setCurrentCity] = useState('Paris');
  const [currentCountry, setCurrentCountry] = useState('France');

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    console.log('Selected address:', address);
  };

  const cities = [
    { city: 'Paris', country: 'France' },
    { city: 'London', country: 'United Kingdom' },
    { city: 'New York', country: 'United States' },
    { city: 'Tokyo', country: 'Japan' },
    { city: 'Berlin', country: 'Germany' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smart Address Search
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search for any address within your selected city using OpenStreetMap data. 
            Type any letter to get instant suggestions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* City/Country selector */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Globe className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Search Location:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {cities.map(({ city, country }) => (
                <button
                  key={`${city}-${country}`}
                  onClick={() => {
                    setCurrentCity(city);
                    setCurrentCountry(country);
                    setSelectedAddress(null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentCity === city && currentCountry === country
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {city}, {country}
                </button>
              ))}
            </div>
          </div>

          {/* Search component */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Find an Address
              </h2>
              <p className="text-gray-600">
                Currently searching in <span className="font-semibold text-blue-600">{currentCity}, {currentCountry}</span>
              </p>
            </div>
            
            <AddressAutocomplete
              city={currentCity}
              country={currentCountry}
              onSelect={handleAddressSelect}
              placeholder={`Search for addresses in ${currentCity}...`}
            />
          </div>

          {/* Selected address display */}
          {selectedAddress && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 rounded-full p-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Selected Address
                  </h3>
                  <p className="text-gray-700 mb-4">{selectedAddress.display_name}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Latitude:</span>
                      <span className="ml-2 text-gray-800">{selectedAddress.lat}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Longitude:</span>
                      <span className="ml-2 text-gray-800">{selectedAddress.lon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to use:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Select a city from the buttons above
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Type any letter or word in the search box
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Use arrow keys to navigate suggestions
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Click on a suggestion or press Enter to select
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDemo;
