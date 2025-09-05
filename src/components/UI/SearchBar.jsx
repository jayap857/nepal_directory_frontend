import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ className = '', size = 'large' }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    navigate(`/search?${params.toString()}`);
  };

  const sizeClasses = {
    large: 'p-4 text-lg',
    medium: 'p-3 text-base',
    small: 'p-2 text-sm'
  };

  return (
    <form onSubmit={handleSearch} className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search businesses, services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full pl-12 pr-4 border-0 rounded-xl focus:ring-2 focus:ring-nepal-blue focus:outline-none ${sizeClasses[size]}`}
          />
        </div>
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full pl-12 pr-4 border-0 rounded-xl focus:ring-2 focus:ring-nepal-blue focus:outline-none ${sizeClasses[size]}`}
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-nepal-blue to-nepal-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;