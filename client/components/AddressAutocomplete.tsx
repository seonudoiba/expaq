
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface Address {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressAutocompleteProps {
  city?: string;
  country?: string;
  onSelect?: (address: Address) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  city = "Paris",
  country = "France",
  onSelect,
  placeholder = "Search for an address...",
  id,
  name,
  onChange,
  onBlur
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Re-run the search when query, city or country changes
  useEffect(() => {
    // Only search if there's a query
    if (query.length < 1) return;
    
    const searchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query + ', ' + city + ', ' + country)}&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=8&` +
          `countrycodes=${country === 'France' ? 'fr' : 'us'}`
        );
        
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchAddresses();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, city, country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (address: Address) => {
    setQuery(address.display_name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSelect?.(address);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={query}
          onChange={(e) => {
            handleInputChange(e);
            // Also trigger the onChange handler from react-hook-form if provided
            if (onChange) onChange(e);
          }}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={(e) => {
            handleBlur();
            // Also trigger the onBlur handler from react-hook-form if provided
            if (onBlur) onBlur(e);
          }}
          placeholder={placeholder}
          className= "flex pl-12 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto"
        >
          <div className="p-2">
            <div className="text-sm text-gray-500 px-3 py-2 border-b border-gray-100">
              Searching in {city}, {country}
            </div>
            {suggestions.map((address, index) => (
              <button
                key={address.place_id}
                onClick={() => handleSuggestionClick(address)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors duration-150 flex items-start space-x-3 ${
                  index === selectedIndex
                    ? 'bg-blue-50 text-blue-900'
                    : 'hover:bg-gray-50'
                }`}
              >
                <MapPin className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  index === selectedIndex ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {address.display_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {address.display_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
