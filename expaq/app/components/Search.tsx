import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaCalendar, FaUsers, FaTags } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Search = () => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    'Cooking', 'Culture', 'Art', 'Music', 'Dance', 
    'Sports', 'Nature', 'Food', 'Wine', 'Language'
  ];

  const locations = [
    'Barcelona, Spain', 'Paris, France', 'Tokyo, Japan',
    'Rome, Italy', 'New York, USA', 'London, UK'
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        {/* Basic Search */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities or hosts..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                <option value="">Select location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                <option value="">Number of people</option>
                {[1, 2, 3, 4, 5, '6+'].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Search Toggle */}
        <button
          onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
          className="mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
        >
          <FaTags className="mr-2" />
          {isAdvancedSearch ? 'Hide filters' : 'Show more filters'}
        </button>

        {/* Advanced Search Options */}
        <AnimatePresence>
          {isAdvancedSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategories.includes(category)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                      <option value="">Any duration</option>
                      <option value="0-2">0-2 hours</option>
                      <option value="2-4">2-4 hours</option>
                      <option value="4-8">4-8 hours</option>
                      <option value="8+">8+ hours</option>
                      <option value="multiple">Multiple days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                      <option value="">Any language</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="it">Italian</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Button */}
        <button className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors btn-transition">
          Search Experiences
        </button>
      </div>
    </div>
  );
};

export default Search;
